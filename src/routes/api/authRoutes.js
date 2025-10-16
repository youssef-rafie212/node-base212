import express from "express";

import { authController } from "../../controllers/api/index.js";
import { authValidation } from "../../validation/api/index.js";
import { authenticate, validateRequest } from "../../middlewares/index.js";

const router = express.Router();

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
    "/request-otp",
    authValidation.validateRequestOtp,
    validateRequest,
    authController.requestOtp
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
    "/reset-password",
    authValidation.validateResetPassword,
    validateRequest,
    authController.resetPassword
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

router.post(
    "/verify-reset-otp",
    authValidation.validateVerifyOtp,
    validateRequest,
    authController.verifyResetOtp
);

router.post("/sign-out", authenticate, authController.signOut);

export default router;
