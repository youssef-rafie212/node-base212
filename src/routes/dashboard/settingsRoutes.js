import express from "express";

import {
    authenticateAdmin,
    authorize,
    validateRequest,
} from "../../middlewares/index.js";
import { SettingsController } from "../../controllers/dashboard/index.js";
import { SettingsService } from "../../services/dashboard/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";
import { settingsValidation } from "../../validation/dashboard/index.js";

const router = express.Router();

const settingsService = new SettingsService();
const settingsController = new SettingsController(settingsService);

router.get("/get-settings", authenticateAdmin, settingsController.getSettings);

router.patch(
    "/update-settings",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    settingsValidation.validateUpdateSettings,
    validateRequest,
    settingsController.updateSettings
);

export default router;
