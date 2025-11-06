import express from "express";

import { UserController } from "../../controllers/api/index.js";
import { UserService } from "../../services/api/index.js";
import { UserValidation } from "../../validation/api/index.js";
import { authenticate, validateRequest } from "../../middlewares/index.js";

const router = express.Router();

const userValidation = new UserValidation();
const userService = new UserService();
const userController = new UserController(userService);

router
    .route("/me")
    .get(authenticate(), userController.me)
    .patch(
        authenticate(),
        userValidation.validateUpdateMe(),
        validateRequest,
        userController.updateMe
    )
    .delete(authenticate(), userController.deleteMe);

export default router;
