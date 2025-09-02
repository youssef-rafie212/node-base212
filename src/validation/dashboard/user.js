import i18n from "i18n";
import { body, query, param, check } from "express-validator";

export const validateCreateUser = [
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
        .withMessage(() => i18n.__("invalidPhone")),

    body("password")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("passwordRequired"))
        .isLength({ min: 6 })
        .withMessage(() => i18n.__("passwordTooShort")),

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
