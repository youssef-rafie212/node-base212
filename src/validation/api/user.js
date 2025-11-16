import i18n from "i18n";
import { body, check } from "express-validator";
import { duplicate, validateCountryExists } from "../../helpers/index.js";
import { User } from "../../models/index.js";

export class UserValidation {
    validateUpdateMe() {
        return [
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
                        req.sub.id
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
                        req.sub.id
                    );
                    if (isDuplicate) {
                        throw i18n.__("phoneExists");
                    }
                    return true;
                }),

            body("name")
                .optional()
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
        ];
    }

    validateUpdateLanguage() {
        return [
            body("language")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("languageRequired"))
                .isIn(["en", "ar"])
                .withMessage(() => i18n.__("invalidLanguage")),
        ];
    }
}
