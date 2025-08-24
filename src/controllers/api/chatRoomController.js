import i18n from "i18n";

import apiError from "../../utils/api/apiError.js";
import apiResponse from "../../utils/api/apiResponse.js";
import ChatRoom from "../../models/chatRoomModel.js";
import { chatRoomObj } from "../../utils/returnObject/returnObject.js";
import getModel from "../../helpers/modelMap/modelMap.js";

// create chat room
export const createChatRoom = async (req, res) => {
    try {
        const data = req.validatedData;

        // validate participants
        data.participants.forEach(async participant => {
            // get model based on type
            const model = getModel(participant.type);

            // check if user exists 
            const user = await model.findOne({_id: participant.id, status: "active", isVerified: true});
            if (!user) {
                return res.status(400).send(apiError(400, i18n.__("userNotFound")));
            }
        });

        // if the room type is a group then set the group admin
        if (data.roomType === "group") {
            data.admin = req.sub.id;
        }

        // set participants
        data.participants = data.participants.map(participant => participant.id);

        // create chat room
        const chatRoom = await ChatRoom.create(data);

        res.send(apiResponse(201, i18n.__("chatRoomCreated"), chatRoomObj(chatRoom, req.lang)));
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

// leave a group room
export const leaveChatRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.sub.id;

        // find chat room
        const chatRoom = await ChatRoom.findById(roomId);
        if (!chatRoom) {
            return res.status(404).send(apiError(404, i18n.__("notFound")));
        }

        // remove user from participants
        chatRoom.participants = chatRoom.participants.filter(
            (participant) => participant.toString() !== userId
        );

        await chatRoom.save();

        res.send(apiResponse(200, i18n.__("chatRoomLeft"), chatRoomObj(chatRoom, req.lang)));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};