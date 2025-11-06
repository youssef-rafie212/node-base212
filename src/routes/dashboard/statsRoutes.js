import express from "express";

import { StatsController } from "../../controllers/dashboard/index.js";
import { StatsService } from "../../services/dashboard/index.js";
import { authenticateAdmin } from "../../middlewares/index.js";

const router = express.Router();

const statsService = new StatsService();
const statsController = new StatsController(statsService);

router.get("/get-stats", authenticateAdmin, statsController.getStats);

export default router;
