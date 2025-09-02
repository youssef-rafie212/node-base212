import express from "express";

import { userController } from "../../controllers/dashboard/index.js";
import { userValidation } from "../../validation/dashboard/index.js";
import { authenticate, validateRequest } from "../../middlewares/index.js";

const router = express.Router();

router.post(
    "/create-user",
    userValidation.validateCreateUser,
    validateRequest,
    userController.createUser
);

export default router;
