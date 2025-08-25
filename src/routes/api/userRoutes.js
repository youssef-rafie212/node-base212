import express from "express";

import { userController } from "../../controllers/api/index.js";
import { userValidation } from "../../validation/api/index.js";
import { authenticate, validateRequest } from "../../middlewares/index.js";

const router = express.Router();

router
    .route("/me")
    .get(authenticate, userController.me)
    .patch(
        authenticate,
        userValidation.validateUpdateMe,
        validateRequest,
        userController.updateMe
    )
    .delete(authenticate, userController.deleteMe);

router.patch(
    "/me/language",
    authenticate,
    userValidation.validateUpdateLanguage,
    validateRequest,
    userController.updateLanguage
);

export default router;
