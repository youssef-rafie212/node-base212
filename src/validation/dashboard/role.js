import i18n from "i18n";
import { body, check } from "express-validator";
import { duplicateArEnName } from "../../helpers/index.js";
import { Role } from "../../models/index.js";

export class RoleValidation {
    validateCreateRole() {
        return [
            body("name.en")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired")),

            body("name.ar")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired")),

            check("name").custom(async (value, { req }) => {
                const duplicate = await duplicateArEnName(Role, value);
                if (duplicate) {
                    throw i18n.__("nameExists");
                }
                return true;
            }),
        ];
    }

    validateGetRole() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateUpdateRoleName() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),

            body("name.en")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired")),

            body("name.ar")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("nameRequired")),

            check("name").custom(async (value, { req }) => {
                const duplicate = await duplicateArEnName(
                    Role,
                    value,
                    req.body.id
                );
                if (duplicate) {
                    throw i18n.__("nameExists");
                }
                return true;
            }),
        ];
    }

    validateDeleteRole() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),
        ];
    }

    validateAddPermissionsToRole() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),

            body("permissions")
                .isArray()
                .withMessage(() => i18n.__("permissionsRequired")),

            body("permissions.*")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("permissionsRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidPermissions")),
        ];
    }

    validateRemovePermissionsFromRole() {
        return [
            body("id")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("idRequired"))
                .isMongoId()
                .withMessage(() => i18n.__("invalidId")),

            body("permissions")
                .isArray()
                .withMessage(() => i18n.__("permissionsRequired")),

            body("permissions.*")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("permissionsRequired"))
                .isString()
                .withMessage(() => i18n.__("invalidPermissions")),
        ];
    }
}
