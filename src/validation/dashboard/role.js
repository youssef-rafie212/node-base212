import i18n from "i18n";
import { body, query, param, check } from "express-validator";

export const validateCreateRole = [
    body("name.en")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("nameRequired")),

    body("name.ar")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("nameRequired")),
];

export const validateGetRole = [
    body("id")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("idRequired"))
        .isMongoId()
        .withMessage(() => i18n.__("invalidId")),
];

export const validateUpdateRoleName = [
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

export const validateDeleteRole = [
    body("id")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("idRequired"))
        .isMongoId()
        .withMessage(() => i18n.__("invalidId")),
];

export const validateAddPermissionsToRole = [
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

export const validateRemovePermissionsFromRole = [
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
