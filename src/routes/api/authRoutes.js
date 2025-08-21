import express from "express";
import * as authController from "../../controllers/api/authController/authController.js";
import * as authValidation from "../../validation/api/auth.js";
import authenticate from "../../middlewares/authenticate/authenticate.js";
import validateRequest from "../../middlewares/validateRequest/validateRequest.js";

const router = express.Router();

router.get("/csrf-token", authController.getCsrfToken);

router.post(
    "/sign-up",
    authValidation.validateSignUp,
    validateRequest,
    authController.signUp
);

router.post(
    "/local-sign-in",
    authValidation.validateLocalSignIn,
    validateRequest,
    authController.localSignIn
);

router.post(
    "/request-otp-email",
    authValidation.validateRequestOtpEmail,
    validateRequest,
    authController.requestOtpEmail
);

router.post(
    "/request-otp-phone",
    authValidation.validateRequestOtpPhone,
    validateRequest,
    authController.requestOtpPhone
);

router.post(
    "/verify-email",
    authValidation.validateVerifyEmail,
    validateRequest,
    authController.verifyEmail
);

router.post(
    "/verify-phone",
    authValidation.validateVerifyPhone,
    validateRequest,
    authController.verifyPhone
);

router.post(
    "/reset-password-email",
    authValidation.validateResetPasswordEmail,
    validateRequest,
    authController.resetPasswordEmail
);

router.post(
    "/reset-password-phone",
    authValidation.validateResetPasswordPhone,
    validateRequest,
    authController.resetPasswordPhone
);

router.post(
    "/social-sign-in",
    authValidation.validateSocialSignIn,
    validateRequest,
    authController.socialSignIn
);

router.post(
    "/complete-data",
    authenticate,
    authValidation.validateCompleteData,
    validateRequest,
    authController.completeData
);

router.post("/sign-out", authenticate, authController.signOut);

export default router;
