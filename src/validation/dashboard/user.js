import i18n from "i18n";
import { body, check } from "express-validator";
import { duplicate, validateCountryExists } from "../../helpers/index.js";
import { User } from "../../models/index.js";

export class DashboardUserValidation {
    validateCreateUser() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("name")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidName")),

            body("email")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("emailRequired"))
                .isEmail()
                .withMessage(() => i18n.__("invalidEmail"))
                .custom(async (value, { req }) => {
                    // check for duplicate email
                    const isDuplicate = await duplicate([User], "email", value);
                    if (isDuplicate) {
                        throw i18n.__("emailExists");
                    }
                    return true;
                }),

            body("phone")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("phoneRequired"))
                .isMobilePhone("any")
                .withMessage(() => i18n.__("invalidPhone"))
                .custom(async (value, { req }) => {
                    if (!value.startsWith("+")) {
                        throw i18n.__("invalidPhone");
                    }

                    // check for duplicate phone
                    const isDuplicate = await duplicate([User], "phone", value);
                    if (isDuplicate) {
                        throw i18n.__("phoneExists");
                    }
                    return true;
                }),

            body("password")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("passwordRequired"))
                .isLength({ min: 6 })
                .withMessage(() => i18n.__("passwordTooShort")),

            body("country")
                .optional()
                .notEmpty()
                .withMessage(() => i18n.__("countryRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidCountry"))
                .custom(async (value) => {
                    const countryExists = await validateCountryExists(value);
                    if (!countryExists) {
                        throw i18n.__("invalidCountry");
                    }
                    return true;
                }),

            body("gender")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("genderRequired"))
                .isIn(["male", "female"])
                .withMessage(() => i18n.__("invalidGender")),

            check("avatar").custom((value, { req }) => {
                // check if the file exists in the request
                if (req.files && req.files.avatar) {
                    const file = req.files.avatar;
                    if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
                        throw i18n.__("invalidImageFormat");
                    }
                }
                return true;
            }),
        ];
    }

    validateGetUserById() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateUpdateUser() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),

            body("name")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidName")),

            body("email")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("emailRequired"))
                .isEmail()
                .withMessage(() => i18n.__("invalidEmail"))
                .custom(async (value, { req }) => {
                    // check for duplicate email
                    const isDuplicate = await duplicate(
                        [User],
                        "email",
                        value,
                        req.body.id
                    );
                    if (isDuplicate) {
                        throw i18n.__("emailExists");
                    }
                    return true;
                }),

            body("phone")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("phoneRequired"))
                .isMobilePhone("any")
                .withMessage(() => i18n.__("invalidPhone"))
                .custom(async (value, { req }) => {
                    if (!value.startsWith("+")) {
                        throw i18n.__("invalidPhone");
                    }

                    // check for duplicate phone
                    const isDuplicate = await duplicate(
                        [User],
                        "phone",
                        value,
                        req.body.id
                    );
                    if (isDuplicate) {
                        throw i18n.__("phoneExists");
                    }
                    return true;
                }),

            body("password")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("passwordRequired"))
                .isLength({ min: 6 })
                .withMessage(() => i18n.__("passwordTooShort")),

            body("country")
                .optional()
                .notEmpty()
                .withMessage(() => i18n.__("countryRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidCountry"))
                .custom(async (value) => {
                    const countryExists = await validateCountryExists(value);
                    if (!countryExists) {
                        throw i18n.__("invalidCountry");
                    }
                    return true;
                }),

            body("gender")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("genderRequired"))
                .isIn(["male", "female"])
                .withMessage(() => i18n.__("invalidGender")),

            check("avatar").custom((value, { req }) => {
                // check if the file exists in the request
                if (req.files && req.files.avatar) {
                    const file = req.files.avatar;
                    if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
                        throw i18n.__("invalidImageFormat");
                    }
                }
                return true;
            }),
        ];
    }

    validateDeleteUserById() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateToggleBlockUserById() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),

            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateGetAllUsers() {
        return [
            body("type")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("typeRequired"))
                .isIn(["user"])
                .withMessage(() => i18n.__("invalidType")),
        ];
    }
}
