import i18n from "i18n";
import { body, query, param, check } from "express-validator";

export const validateUpdateSettings = [
    body("linkAndroid")
        .optional()
        .trim()
        .isURL()
        .withMessage(() => i18n.__("invalidLinkAndroid")),

    body("linkApple")
        .optional()
        .trim()
        .isURL()
        .withMessage(() => i18n.__("invalidLinkApple")),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("any")
        .withMessage(() => i18n.__("invalidPhone")),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage(() => i18n.__("invalidEmail")),

    body("appTitle.ar")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("invalidAppTitleAr"))
        .isString()
        .withMessage(() => i18n.__("invalidAppTitleAr")),

    body("appTitle.en")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("invalidAppTitleEn"))
        .isString()
        .withMessage(() => i18n.__("invalidAppTitleEn")),

    body("codeGenerate")
        .optional()
        .isBoolean()
        .withMessage(() => i18n.__("invalidCodeGenerate")),

    body("code")
        .optional()
        .trim()
        .isString()
        .withMessage(() => i18n.__("invalidCode")),

    body("dashboardSecretToken")
        .optional()
        .trim()
        .isString()
        .withMessage(() => i18n.__("invalidDashboardSecretToken")),

    body("version")
        .optional()
        .trim()
        .matches(/^\d+\.\d+(\.\d+)?$/) // e.g. 1.0 or 1.0.0
        .withMessage(() => i18n.__("invalidVersion")),
];
