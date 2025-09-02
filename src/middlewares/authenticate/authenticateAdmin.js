import jwt from "jsonwebtoken";
import i18n from "i18n";

import { Admin } from "../../models/index.js";
import { apiError } from "../../utils/index.js";

// middleware that protects routes and authenticates the user
const authenticateAdmin = (req, res, next) => {
    try {
        // extract the token from headers
        const token = req.headers.authorization?.split(" ")[1];

        // check if token exists in the headers
        if (!token) {
            return res.status(401).send(apiError(401, i18n.__("unauthorized")));
        }

        // verify the token
        jwt.verify(
            token,
            process.env.JWT_SECRET || "default_secret",
            async (err, decoded) => {
                if (err) {
                    return res
                        .status(401)
                        .send(apiError(401, i18n.__("unauthorized")));
                }

                // find user by id
                const admin = await Admin.findById(decoded.id);

                // validate the user
                if (!admin || admin.status !== "active") {
                    return res
                        .status(401)
                        .send(apiError(401, i18n.__("unauthorized")));
                }

                // assign the decoded token to the request
                req.admin = decoded;

                next();
            }
        );
    } catch (error) {
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authenticateAdmin;
