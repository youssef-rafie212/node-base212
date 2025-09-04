import express from "express";

import {
    authenticateAdmin,
    authorize,
    validateRequest,
} from "../../middlewares/index.js";
import { notificationController } from "../../controllers/dashboard/index.js";
import { notificationValidation } from "../../validation/dashboard/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

router.post(
    "/send-single-notification",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    notificationValidation.validateSendSingleNotification,
    validateRequest,
    notificationController.sendSingleNotification
);

router.post(
    "/send-all-notification",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    notificationValidation.validateSendAllNotification,
    validateRequest,
    notificationController.sendAllNotification
);

export default router;
