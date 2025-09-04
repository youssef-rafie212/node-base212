import i18n from "i18n";

import { body } from "express-validator";

export const validateSendSingleNotification = [
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

    body("title.en")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("titleRequired")),

    body("title.ar")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("titleRequired")),

    body("message.en")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("messageRequired")),

    body("message.ar")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("messageRequired")),
];

export const validateSendAllNotification = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("typeRequired"))
        .isIn(["user"])
        .withMessage(() => i18n.__("invalidType")),

    body("title.en")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("titleRequired")),

    body("title.ar")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("titleRequired")),

    body("message.en")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("messageRequired")),

    body("message.ar")
        .trim()
        .notEmpty()
        .withMessage(() => i18n.__("messageRequired")),
];
