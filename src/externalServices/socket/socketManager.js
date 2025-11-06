import i18n from "i18n";
import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { UserToken, ChatRoom, ChatMessage } from "../../models/index.js";
import { returnObject } from "../../utils/index.js";
import { getModel, getRef } from "../../helpers/index.js";
import { JwtConfig, ServerConfig } from "../../../config/index.js";

let io;
export const connectedUsers = new Map(); // store connected users (fallback when Redis is unavailable)

// get socket instance for a user by userId
export const getUserSocket = (userId) => {
    const socketId = connectedUsers.get(userId);
    return socketId ? io.sockets.sockets.get(socketId) : null;
};

// initialize socket.io
export const initializeSocket = async (server, app) => {
    io = new Server(server, {
        cors: {
            origin: ServerConfig.allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // authentication middleware
    io.use(async (socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token || socket.handshake.headers.token;

            if (!token) {
                const err = new Error(i18n.__("unauthorized"));
                err.status = 401;
                return next(err);
            }

            // verify JWT
            const decoded = jwt.verify(token, JwtConfig.secret);

            // get model based on type
            const model = getModel(decoded.userType);

            // get user from DB
            const user = await model.findOne({
                _id: decoded.id,
                status: "active",
                isVerified: true,
            });

            if (!user) {
                const err = new Error(i18n.__("unauthorized"));
                err.status = 401;
                return next(err);
            }

            // check if token exists in the DB
            const tokenExists = await UserToken.findOne({
                token: token,
            });

            if (!tokenExists) {
                const err = new Error(i18n.__("unauthorized"));
                err.status = 401;
                return next(err);
            }

            // attach user data to socket
            socket.userId = user._id.toString();
            socket.lang = user.language || "ar";
            socket.userType = user.type;

            // cache socket
            connectedUsers.set(socket.userId, socket.id);

            console.log(
                `✅ User ${socket.userId} authenticated with socket ID: ${socket.id}`
            );
            next();
        } catch (err) {
            console.error("Socket auth error:", err);
            next(new Error(i18n.__("returnDeveloper")));
        }
    });

    app.set("io", io);

    io.on("connection", (socket) => {
        console.log(`Socket connected with socket id: ${socket.id}`);

        // handle get chat messages
        socket.on(
            "getChat",
            async ({ otherId, otherType, page = 1, limit = 20 }) => {
                try {
                    // validate otherId parameter
                    if (!otherId) {
                        return socket.emit("fail", {
                            message: i18n.__("invalidRequest"),
                        });
                    }

                    // validate if otherId is a valid mongoDB objectId
                    if (!mongoose.Types.ObjectId.isValid(otherId)) {
                        return socket.emit("fail", {
                            message: i18n.__("invalidId"),
                        });
                    }

                    // check if trying to chat with themselves
                    if (socket.userId === otherId) {
                        return socket.emit("fail", {
                            message: i18n.__("cannotChatWithSelf"),
                        });
                    }

                    // get model based on otherType
                    const model = getModel(otherType);

                    // validate if otherType is a valid model
                    if (!model) {
                        return socket.emit("fail", {
                            message: i18n.__("invalidType"),
                        });
                    }

                    // check if target user exists and is active
                    const targetUser = await model.findOne({
                        _id: otherId,
                        status: { $ne: "delete" },
                        isVerified: true,
                    });

                    if (!targetUser) {
                        return socket.emit("fail", {
                            message: i18n.__("userNotFound"),
                        });
                    }

                    // parse pagination parameters
                    const pageNum = parseInt(page) || 1;
                    const limitNum = parseInt(limit) || 20;
                    const skipNum = (pageNum - 1) * limitNum;

                    console.log("CURRENT SOCKET DATA", socket);

                    // find or create chat room between the two users
                    const chatRoom = await ChatRoom.findOrCreateChatRoom(
                        socket.userId,
                        socket.userType,
                        otherId,
                        otherType
                    );

                    let messages = [];
                    let totalCount = 0;

                    if (chatRoom) {
                        // get total count of messages in this chat room
                        totalCount = await ChatMessage.countDocuments({
                            chatRoom: chatRoom._id,
                        });

                        // get messages with pagination (latest first)
                        if (totalCount > 0) {
                            messages = await ChatMessage.find({
                                chatRoom: chatRoom._id,
                            })
                                .select("sender content messageType createdAt")
                                .populate("sender", "name avatar")
                                .sort({ createdAt: -1 }) // Latest messages first
                                .skip(skipNum)
                                .limit(limitNum);
                        }

                        // reset unread count for current user
                        await chatRoom.resetUnreadCount(socket.userId);
                    }

                    // calculate pagination info
                    const totalPages = Math.ceil(totalCount / limitNum);

                    // Prepare pagination object
                    const paginationInfo = {
                        currentPage: pageNum,
                        totalPages: totalPages,
                        limit: limitNum,
                        totalCount: totalCount,
                    };

                    // format and send chat data using returnObject helper with language support
                    const chatDataResponse = messages.map((message) =>
                        returnObject.chatMessageObj(message, socket.lang)
                    );

                    socket.join(chatRoom._id.toString());
                    socket.emit("chatData", {
                        roomId: chatRoom._id.toString(),
                        messages: chatDataResponse,
                        paginationInfo,
                    });

                    console.log(
                        `Chat data sent for user ${socket.userId} with ${otherId}, page ${pageNum}`
                    );
                } catch (error) {
                    console.error("Error in getChat event:", error);
                    socket.emit("fail", {
                        message: i18n.__("returnDeveloper"),
                    });
                }
            }
        );

        // handle send message
        socket.on("sendMessage", async ({ roomId, content }) => {
            try {
                // check if user is initialized
                if (!socket.userId) {
                    return socket.emit("fail", {
                        message: i18n.__("notInitialized"),
                    });
                }

                // validate required parameters
                if (!roomId || !content) {
                    return socket.emit("fail", {
                        message: i18n.__("invalidRequest"),
                    });
                }

                // validate message content
                if (content.trim().length === 0) {
                    return socket.emit("fail", {
                        message: i18n.__("messageCannotBeEmpty"),
                    });
                }

                // validate if roomId is a valid MongoDB ObjectId
                if (!mongoose.Types.ObjectId.isValid(roomId)) {
                    return socket.emit("fail", {
                        message: i18n.__("invalidId"),
                    });
                }

                // find the chat room and validate user access
                const chatRoom = await ChatRoom.findOne({
                    _id: roomId,
                    "participants.user": socket.userId,
                    status: "active",
                });

                if (!chatRoom) {
                    return socket.emit("fail", {
                        message: i18n.__("roomNotFound"),
                    });
                }

                // create the message
                const newMessage = await ChatMessage.create({
                    chatRoom: chatRoom._id,
                    sender: socket.userId,
                    userRef: getRef(socket.userType),
                    content: content,
                    messageType: "text",
                });

                // update chat room's last message and timestamp
                await ChatRoom.findByIdAndUpdate(chatRoom._id, {
                    lastMessage: newMessage._id,
                    lastMessageAt: newMessage.createdAt,
                });

                const formattedMessage = returnObject.chatMessageObj(
                    newMessage,
                    socket.lang
                );

                // also emit to chat room (if recipient is in the room)
                io.to(roomId).emit("newMessage", {
                    message: formattedMessage,
                });

                const friendId = chatRoom.participants.find(
                    (participant) =>
                        participant.user.toString() !== socket.userId
                ).user;
                const recipientSocketId = connectedUsers.get(
                    friendId.toString()
                );

                // check if recipient is in this room
                const socketIsInRoom = io.sockets.adapter.rooms
                    .get(roomId)
                    ?.has(recipientSocketId);

                if (!recipientSocketId || !socketIsInRoom) {
                    // increment unread count for the recipient
                    await chatRoom.incrementUnreadCount(friendId);
                    console.log(
                        `Recipient ${friendId} is not in the chat room, message stored for later`
                    );

                    if (!recipientSocketId) {
                        // TODO: send push notification to offline user
                    }
                }

                console.log(
                    `Message sent from ${socket.userId} to ${friendId} in chat room ${chatRoom._id}`
                );
            } catch (error) {
                console.error("Error in sendMessage event:", error);
                socket.emit("fail", {
                    message: i18n.__("returnDeveloper"),
                });
            }
        });

        // handle leave chat
        // note: this means that the user closed the chat room and still in the app
        // it does not mean that the user left the room like leaving a group
        socket.on("leaveChat", async ({ roomId }) => {
            if (!roomId) {
                return socket.emit("fail", {
                    message: i18n.__("invalidRequest"),
                });
            }

            socket.leave(roomId);

            socket.emit("leftChat", { roomId });

            console.log(`User ${socket.userId} left room ${roomId}`);
        });

        // handle disconnect
        socket.on("disconnect", () => {
            console.log(`User ${socket.userId} disconnected`);

            connectedUsers.delete(socket.userId);

            delete socket.userId;

            delete socket.lang;
        });
    });

    return io;
};
