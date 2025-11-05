import i18n from "i18n";

import { Admin } from "../../models/index.js";
import {
    generateCsrfToken,
    returnObject,
    generateJwt,
} from "../../utils/index.js";

export class AuthService {
    getCsrf(req, res) {
        const token = generateCsrfToken(req, res);
        return {
            error: null,
            data: {
                token,
            },
        };
    }

    async adminSignIn(data) {
        // find admin by email
        const admin = await Admin.findOne({
            email: data.email,
            status: "active",
        }).populate("role");

        if (!admin) {
            return {
                error: i18n.__("invalidCredentials"),
                data: null,
            };
        }

        // check password
        const isMatch = await admin.comparePassword(data.password);
        if (!isMatch) {
            return {
                error: i18n.__("invalidCredentials"),
                data: null,
            };
        }

        // generate token
        const token = generateJwt(admin._id, "admin");

        // generate response object
        const resObject = returnObject.adminWithTokenObj(
            admin,
            admin.role,
            token
        );

        return {
            error: null,
            data: resObject,
        };
    }
}
