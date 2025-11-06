import i18n from "i18n";
import { body, query, param, check } from "express-validator";

export class DashboardAuthValidation {
    validateAdminSignIn() {
        return [
            body("email")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("emailRequired"))
                .isEmail()
                .withMessage(() => i18n.__("invalidEmail")),

            body("password")
                .trim()
                .notEmpty()
                .withMessage(() => i18n.__("passwordRequired"))
                .isLength({ min: 6 })
                .withMessage(() => i18n.__("passwordTooShort")),
        ];
    }
}
