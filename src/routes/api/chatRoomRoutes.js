import express from "express";

import { ChatRoomController } from "../../controllers/api/index.js";
import { ChatRoomService } from "../../services/api/index.js";
import { authenticate } from "../../middlewares/index.js";

const router = express.Router();

const chatRoomService = new ChatRoomService();
const chatRoomController = new ChatRoomController(chatRoomService);

router.get("/", authenticate(), chatRoomController.getChatRooms);

export default router;
