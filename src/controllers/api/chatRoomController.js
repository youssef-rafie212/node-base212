import i18n from "i18n";

import { apiError, apiResponse, returnObject } from "../../utils/index.js";
import { ChatRoom } from "../../models/index.js";

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
        const query = { "participants.user": id, status: { $ne: "deleted" } };
        const [totalCount, chatRooms] = await Promise.all([
            ChatRoom.countDocuments(query),
            ChatRoom.find(query)
                .populate("participants.user")
                .populate({
                    path: "lastMessage",
                    populate: {
                        path: "sender",
                        select: "name avatar",
                    },
                })
                .skip(skip)
                .limit(limit),
        ]);

        // format chat room objects
        const chatRoomObjects = chatRooms.map((room) =>
            returnObject.chatRoomObj(room, req.lang)
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
