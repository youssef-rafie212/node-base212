import i18n from "i18n";

import { Admin } from "../../models/index.js";
import {
    apiError,
    apiResponse,
    generateCsrfToken,
    returnObject,
    generateJwt,
} from "../../utils/index.js";

// generate a csrf token for the current request
export const getCsrfToken = (req, res) => {
    const token = generateCsrfToken(req, res);
    res.send(apiResponse(200, i18n.__("tokenGenerated"), { token }));
};

// admin sgin in
export const adminSignIn = async (req, res) => {
    try {
        const data = req.validatedData;

        // find admin by email
        const admin = await Admin.findOne({
            email: data.email,
            status: "active",
        }).populate("role");

        if (!admin) {
            return res
                .status(401)
                .send(apiError(401, i18n.__("invalidCredentials")));
        }

        // check password
        const isMatch = await admin.comparePassword(data.password);
        if (!isMatch) {
            return res
                .status(401)
                .send(apiError(401, i18n.__("invalidCredentials")));
        }

        // generate token
        const token = generateJwt(admin._id, "admin");

        // generate response object
        const resObject = returnObject.adminWithTokenObj(
            admin,
            admin.role,
            token
        );

        res.send(apiResponse(200, i18n.__("successfulLogin"), resObject));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
