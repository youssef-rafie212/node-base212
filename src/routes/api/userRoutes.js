import express from "express";
import authenticate from "../../middlewares/authenticate/authenticate.js";
import * as userController from "../../controllers/api/userController.js";
import * as userValidation from "../../validation/api/user.js";
import validateRequest from "../../middlewares/validateRequest/validateRequest.js";

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
