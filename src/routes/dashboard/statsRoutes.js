import express from "express";

import { statsController } from "../../controllers/dashboard/index.js";

import { authenticateAdmin } from "../../middlewares/index.js";

const router = express.Router();

router.get("/get-stats", authenticateAdmin, statsController.getStats);

export default router;
