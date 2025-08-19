import { body, query, param, check } from "express-validator";
import i18n from "i18n";

export const validateSignUp = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw {
                message: i18n.__("passwordsDoNotMatch"),
            };
        }
        return true;
    }),

    body("name")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("nameRequired")),

    check("avatar").custom((value, { req }) => {
        // Check if the file exists in the request
        if (req.files && req.files.avatar) {
            const file = req.files.avatar;
            if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
                throw {
                    message: i18n.__("invalidImageFormat"),
                };
            }
        }
        return true;
    }),

    body("fcmToken")
        .optional()
        .notEmpty()
        .withMessage(() => i18n.__("fcmTokenRequired")),

    body("deviceType")
        .optional()
        .notEmpty()
        .withMessage(() => i18n.__("deviceTypeRequired"))
        .isIn(["android", "ios", "web"])
        .withMessage(() => i18n.__("invalidDeviceType")),

    // other fields ...
];

export const validateLocalSignIn = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("fcmToken")
        .optional()
        .notEmpty()
        .withMessage(() => i18n.__("fcmTokenRequired")),

    body("deviceType")
        .optional()
        .notEmpty()
        .withMessage(() => i18n.__("deviceTypeRequired"))
        .isIn(["android", "ios", "web"])
        .withMessage(() => i18n.__("invalidDeviceType")),
];

export const validateVerifyEmail = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("otpRequired"))
        .isLength({ min: 6, max: 6 })
        .withMessage(() => i18n.__("invalidOtp")),
];

export const validateVerifyPhone = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("Phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone()
        .withMessage(() => i18n.__("invalidPhone")),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("otpRequired"))
        .isLength({ min: 6, max: 6 })
        .withMessage(() => i18n.__("invalidOtp")),
];

export const validateCompleteData = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("id")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("idRequired"))
        .isMongoId()
        .withMessage(() => i18n.__("invalidId")),

    // other fields ...
];

export const validateForgotPasswordEmail = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),
];

export const validateForgotPasswordPhone = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("Phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone()
        .withMessage(() => i18n.__("invalidPhone")),
];

export const validateResetPasswordEmail = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw {
                message: i18n.__("passwordsDoNotMatch"),
            };
        }
        return true;
    }),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("otpRequired"))
        .isLength({ min: 6, max: 6 })
        .withMessage(() => i18n.__("invalidOtp")),
];

export const validateResetPasswordPhone = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["User"])
        .withMessage(() => i18n.__("invalidType")),

    body("Phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone()
        .withMessage(() => i18n.__("invalidPhone")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw {
                message: i18n.__("passwordsDoNotMatch"),
            };
        }
        return true;
    }),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("otpRequired"))
        .isLength({ min: 6, max: 6 })
        .withMessage(() => i18n.__("invalidOtp")),
];
