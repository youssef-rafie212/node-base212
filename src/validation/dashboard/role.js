import i18n from "i18n";
import { body, query, param, check } from "express-validator";

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
