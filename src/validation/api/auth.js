import i18n from "i18n";
import { body, param, check } from "express-validator";

export class AuthValidation {
    validateGenerateToken() {
        return [
            param("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateSignUp() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("email")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("emailRequired"))
                .isEmail()
                .withMessage(() => i18n.__("invalidEmail")),

            body("phone")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("phoneRequired"))
                .isMobilePhone("any")
                .withMessage(() => i18n.__("invalidPhone"))
                .custom((value, { req }) => {
                    if (!value.startsWith("+")) {
                        throw i18n.__("invalidPhone");
                    }
                    return true;
                }),

            // make sure ate least email or phone is provided
            check().custom((value, { req }) => {
                if (!req.body.email && !req.body.phone) {
                    throw i18n.__("emailOrPhoneRequired");
                }
                return true;
            }),

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
    }

    validateRequestOtp() {
        return [
            body("identifier")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("identifierRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidIdentifier")),
        ];
    }

    validateLocalSignIn() {
        return [
            body("email")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("emailRequired"))
                .isEmail()
                .withMessage(() => i18n.__("invalidEmail")),

            body("phone")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("phoneRequired"))
                .isMobilePhone("any")
                .withMessage(() => i18n.__("invalidPhone"))
                .custom((value, { req }) => {
                    if (!value.startsWith("+")) {
                        throw i18n.__("invalidPhone");
                    }
                    return true;
                }),

            // make sure ate least email or phone is provided
            check().custom((value, { req }) => {
                if (!req.body.email && !req.body.phone) {
                    throw i18n.__("emailOrPhoneRequired");
                }
                return true;
            }),

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
    }

    validateVerifyEmail() {
        [
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

            body("otp")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("otpRequired"))
                .isLength({ min: 6, max: 6 })
                .withMessage(() => i18n.__("invalidOtp")),
        ];
    }

    validateVerifyPhone() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

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
    }

    validateCompleteData() {
        return [];
    }

    validateVerifyOtp() {
        return [
            body("identifier")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("identifierRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidIdentifier")),

            body("otp")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("otpRequired"))
                .isLength({ min: 6, max: 6 })
                .withMessage(() => i18n.__("invalidOtp")),
        ];
    }

    validateResetPassword() {
        return [
            body("identifier")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("identifierRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidIdentifier")),

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
        ];
    }

    validateSocialSignIn() {
        return [
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
    }
}
