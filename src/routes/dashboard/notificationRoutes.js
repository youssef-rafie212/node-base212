import express from "express";

import {
    authenticateAdmin,
    authorize,
    validateRequest,
} from "../../middlewares/index.js";
import { NotificationController } from "../../controllers/dashboard/index.js";
import { NotificationService } from "../../services/dashboard/index.js";
import { NotificationValidation } from "../../validation/dashboard/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

const notificationValidation = new NotificationValidation();
const notificationService = new NotificationService();
const notificationController = new NotificationController(notificationService);

router.post(
    "/send-single-notification",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    notificationValidation.validateSendSingleNotification(),
    validateRequest,
    notificationController.sendSingleNotification
);

router.post(
    "/send-all-notification",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    notificationValidation.validateSendAllNotification(),
    validateRequest,
    notificationController.sendAllNotification
);

export default router;
