import express from "express";

import { chatRoomController } from "../../controllers/api/index.js";
import { authenticate } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", authenticate, chatRoomController.getChatRooms);

export default router;
