import express from "express";

import { UserController } from "../../controllers/dashboard/index.js";
import { UserService } from "../../services/dashboard/index.js";
import { userValidation } from "../../validation/dashboard/index.js";
import {
    authenticateAdmin,
    validateRequest,
    authorize,
} from "../../middlewares/index.js";
import { doubleCsrfProtection } from "../../utils/index.js";

const router = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

router.post(
    "/create-new-user",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    userValidation.validateCreateUser,
    validateRequest,
    userController.createUser
);

router.get(
    "/get-all-users",
    authenticateAdmin,
    authorize,
    userValidation.validateGetAllUsers,
    validateRequest,
    userController.getAllUsers
);

router.get(
    "/get-user",
    authenticateAdmin,
    authorize,
    userValidation.validateGetUserById,
    validateRequest,
    userController.getUser
);

router.patch(
    "/update-user",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    userValidation.validateUpdateUser,
    validateRequest,
    userController.updateUser
);

router.delete(
    "/delete-user",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    userValidation.validateDeleteUserById,
    validateRequest,
    userController.deleteUser
);

router.patch(
    "/toggle-block-user",
    doubleCsrfProtection,
    authenticateAdmin,
    authorize,
    userValidation.validateToggleBlockUserById,
    validateRequest,
    userController.toggleBlockUser
);

export default router;
