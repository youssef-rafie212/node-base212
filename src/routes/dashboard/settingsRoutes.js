import express from "express";

import {
    authenticateAdmin,
    authorize,
    validateRequest,
} from "../../middlewares/index.js";
import { settingsController } from "../../controllers/dashboard/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";
import { settingsValidation } from "../../validation/dashboard/index.js";

const router = express.Router();

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
