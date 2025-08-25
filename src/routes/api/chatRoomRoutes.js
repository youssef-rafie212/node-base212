import express from "express";

import { chatRoomController } from "../../controllers/api/index.js";
import { chatRoomValidation } from "../../validation/api/index.js";
import { authenticate, validateRequest } from "../../middlewares/index.js";

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
