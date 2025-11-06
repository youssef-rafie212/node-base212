import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class ChatRoomController {
    constructor(chatRoomService) {
        this.chatRoomService = chatRoomService;

        // bind all methods
        this.getChatRooms = this.getChatRooms.bind(this);
    }

    async getChatRooms(req, res) {
        try {
            // get current user id
            const { id } = req.sub;

            // pagination data
            const { page = 1, limit = 10 } = req.query;

            const response = await this.chatRoomService.getChatRooms(
                id,
                req.lang,
                page,
                limit
            );

            if (response.error) {
                res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(
                    200,
                    i18n.__("chatRoomsFetched"),
                    response.data,
                    response.totalCount,
                    response.page,
                    response.totalPages
                )
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
