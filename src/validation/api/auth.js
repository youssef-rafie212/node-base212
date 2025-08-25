import i18n from "i18n";
import { body, query, param, check } from "express-validator";

export const validateGenerateToken = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("idRequired"))
        .isMongoId()
        .withMessage(() => i18n.__("invalidId")),
];

export const validateSignUp = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["user"])
        .withMessage(() => i18n.__("invalidType")),

    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone("any")
        .withMessage(() => i18n.__("invalidPhone")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("passwordConfirm")
        .notEmpty()
        .withMessage(() => i18n.__("passwordConfirmRequired"))
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw i18n.__("passwordsDoNotMatch");
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
                throw i18n.__("invalidImageFormat");
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

    body("country")
        .optional()
        .notEmpty()
        .withMessage(() => i18n.__("countryRequired"))
        .isMongoId()
        .withMessage(() => i18n.__("invalidCountry")),

    body("gender")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("genderRequired"))
        .isIn(["male", "female"])
        .withMessage(() => i18n.__("invalidGender")),
    // other fields ...
];

export const validateRequestOtpEmail = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("emailRequired"))
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),
];

export const validateRequestOtpPhone = [
    body("phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone("any")
        .withMessage(() => i18n.__("invalidPhone")),
];

export const validateLocalSignIn = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["user"])
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
    body("phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone("any")
        .withMessage(() => i18n.__("invalidPhone")),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("otpRequired"))
        .isLength({ min: 6, max: 6 })
        .withMessage(() => i18n.__("invalidOtp")),
];

export const validateCompleteData = [
    // other fields ...
];

export const validateResetPasswordEmail = [
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

    body("passwordConfirm")
        .notEmpty()
        .withMessage(() => i18n.__("passwordConfirmRequired"))
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw i18n.__("passwordsDoNotMatch");
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
    body("phone")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("phoneRequired"))
        .isMobilePhone("any")
        .withMessage(() => i18n.__("invalidPhone")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

    body("passwordConfirm")
        .notEmpty()
        .withMessage(() => i18n.__("passwordConfirmRequired"))
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw i18n.__("passwordsDoNotMatch");
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

export const validateSocialSignIn = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["user"])
        .withMessage(() => i18n.__("invalidType")),

    body("idToken")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("idTokenRequired")),
];
