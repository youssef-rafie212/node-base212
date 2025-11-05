import { returnObject } from "../../utils/index.js";
import { ChatRoom } from "../../models/index.js";

export class ChatRoomService {
    async getChatRooms(id, lang, page = 1, limit = 10) {
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
            returnObject.chatRoomObj(room, lang)
        );

        // calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        return {
            error: null,
            data: chatRoomObjects,
            totalCount,
            page,
            totalPages,
        };
    }
}
