import express from "express";

import { authController } from "../../controllers/dashboard/index.js";
import { authValidation } from "../../validation/dashboard/index.js";
import { authenticateAdmin, validateRequest } from "../../middlewares/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

router.get("/get-csrf-token", authController.getCsrfToken);

router.post(
    "/sign-in",
    doubleCsrfProtection,
    authValidation.validateAdminSignIn,
    validateRequest,
    authController.adminSignIn
);

export default router;
