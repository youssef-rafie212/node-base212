import express from "express";

import { AuthController } from "../../controllers/dashboard/index.js";
import { AuthService } from "../../services/dashboard/index.js";
import { DashboardAuthValidation } from "../../validation/dashboard/index.js";
import { validateRequest } from "../../middlewares/index.js";

const authValidation = new DashboardAuthValidation();
const authService = new AuthService();
const authController = new AuthController(authService);

const router = express.Router();

router.get("/get-csrf-token", authController.getCsrf);

router.post(
    "/sign-in",
    authValidation.validateAdminSignIn(),
    validateRequest,
    authController.adminSignIn
);

export default router;
