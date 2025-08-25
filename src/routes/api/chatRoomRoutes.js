import express from "express";

import authenticate from "../../middlewares/authenticate/authenticate.js";
import * as chatRoomController from "../../controllers/api/chatRoomController.js";
import * as chatRoomValidation from "../../validation/api/chatRoom.js";
import validateRequest from "../../middlewares/validateRequest/validateRequest.js";

const router = express.Router();

router
    .route("/")
    .post(
        authenticate,
        chatRoomValidation.validateCreateChatRoom,
        validateRequest,
        chatRoomController.createChatRoom
    )
    .get(authenticate, chatRoomController.getChatRooms);

export default router;
