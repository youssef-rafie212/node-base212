import i18n from "i18n";

import apiError from "../../utils/api/apiError.js";
import apiResponse from "../../utils/api/apiResponse.js";
import ChatRoom from "../../models/chatRoomModel.js";
import { chatRoomObj } from "../../utils/returnObject/returnObject.js";
import User from "../../models/userModel.js";

// create chat room
export const createChatRoom = async (req, res) => {
    try {
        const data = req.validatedData;

        // validate participants
        data.participants.forEach(async (participant) => {
            // check if user exists
            const user = await User.findOne({
                _id: participant,
                status: "active",
                isVerified: true,
            });
            if (!user) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("userNotFound")));
            }
        });

        // create chat room
        const chatRoom = await ChatRoom.create(data);

        // populate related fields for object creation
        await chatRoom.populate("participants lastMessage");

        res.send(
            apiResponse(
                200,
                i18n.__("chatRoomCreated"),
                chatRoomObj(chatRoom, req.lang)
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// get user's chat rooms
export const getChatRooms = async (req, res) => {
    try {
        // get current user id
        const { id } = req.sub;

        // pagination
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // get chat rooms and total count
        const query = { participants: id, status: { $ne: "deleted" } };
        const [totalCount, chatRooms] = await Promise.all([
            ChatRoom.countDocuments(query),
            ChatRoom.find(query)
                .populate("participants lastMessage")
                .skip(skip)
                .limit(limit),
        ]);

        // format chat room objects
        const chatRoomObjects = chatRooms.map((room) =>
            chatRoomObj(room, req.lang)
        );

        // calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        res.send(
            apiResponse(
                200,
                i18n.__("chatRoomsFetched"),
                chatRoomObjects,
                totalCount,
                page,
                totalPages
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
