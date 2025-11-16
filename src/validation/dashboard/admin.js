import i18n from "i18n";
import { body, check } from "express-validator";
import { duplicate, validateRole } from "../../helpers/index.js";
import { Admin } from "../../models/index.js";

export class AdminValidation {
    validateCreateAdmin() {
        return [
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
                    const isDuplicate = await duplicate(
                        [Admin],
                        "email",
                        value
                    );
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
                    const isDuplicate = await duplicate(
                        [Admin],
                        "phone",
                        value
                    );
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

            body("role")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("roleRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidRole"))
                .custom(async (value, { req }) => {
                    // validate role exists and not super admin
                    const validRole = await validateRole(value, false);
                    if (!validRole) {
                        throw i18n.__("invalidRole");
                    }
                    return true;
                }),

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

    validateGetAdminById() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateUpdateAdmin() {
        return [
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
                        [Admin],
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
                        [Admin],
                        "phone",
                        value
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

            body("role")
                .optional()
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("roleRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidRole"))
                .custom(async (value, { req }) => {
                    // validate role exists and not super admin
                    const validRole = await validateRole(value, false);
                    if (!validRole) {
                        throw i18n.__("invalidRole");
                    }
                    return true;
                }),

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

    validateDeleteAdminById() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateToggleBlockAdminById() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }
}
