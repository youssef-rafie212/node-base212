import { Server } from "socket.io";
import mongoose from "mongoose";
import i18n from "i18n";

import User from "../../models/userModel.js";

let io;
export const connectedUsers = new Map(); // Store connected users (fallback when Redis is unavailable)

// Initialize Socket.IO
export const initializeSocket = async (server, app) => {
    io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS
                ? process.env.ALLOWED_ORIGINS.split(",")
                : ["http://localhost:3000", "http://127.0.0.1:3000"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
        console.log(`Socket connected with socket id: ${socket.id}`);

        // Handle user initialization
        socket.on("initializeUser", async ({ userId }) => {
            try {
                if (!userId) {
                    return socket.emit("fail", {
                        key: "initializeUser",
                        message: i18n.__("userIdRequired"),
                    });
                }

                // Validate if userId is a valid MongoDB ObjectId
                if (!mongoose.Types.ObjectId.isValid(userId)) {
                    return socket.emit("fail", {
                        key: "initializeUser",
                        message: i18n.__("invalidUserId"),
                    });
                }

                // Check if user is already connected (Redis first, fallback to Map)
                const existingSocketId = connectedUsers.get(userId);
                if (existingSocketId) {
                    return socket.emit("fail", {
                        key: "initializeUser",
                        message: i18n.__("alreadyInitialized"),
                    });
                }

                // Get user from database (only fetch when connecting)
                const userData = await User.findById(userId);
                if (!userData) {
                    return socket.emit("fail", {
                        key: "initializeUser",
                        message: i18n.__("userNotFound"),
                    });
                }

                // Set userId on the socket
                socket.userId = userId;

                // Cache connected user data and add to connected users (Redis and Map for fallback)
                connectedUsers.set(userId, socket.id);

                console.log(
                    `User ${userId} initialized with socket ID: ${socket.id}`
                );

                // Send confirmation back to client
                socket.emit("initialized", { userId });
            } catch (error) {
                console.error("Error initializing user:", error);
                socket.emit("fail", {
                    key: "initializeUser",
                    message: i18n.__("returnDeveloper"),
                });
            }
        });

        // Events
    });

    return io;
};
