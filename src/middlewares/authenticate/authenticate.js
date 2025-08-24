import jwt from "jsonwebtoken";
import i18n from "i18n";

import UserToken from "../../models/userToken.js";
import apiError from "../../utils/api/apiError.js";
import User from "../../models/userModel.js";

// middleware that protects routes and authenticates the user
const authenticate = (req, res, next) => {
    try {
        // extract the token from headers
        const token = req.headers.authorization?.split(" ")[1];

        // check if token exists in the headers
        if (!token) {
            return res.send(apiError(401, i18n.__("unauthorized")));
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
                const user = await User.findById(decoded.id);

                // validate the user
                if (!user || user.status !== "active" || !user.isVerified) {
                    return res
                        .status(401)
                        .send(apiError(401, i18n.__("unauthorized")));
                }

                // check if the token exists in the database
                const userToken = await UserToken.findOne({
                    token,
                    userId: decoded.id,
                });
                if (!userToken) {
                    return res
                        .status(401)
                        .send(apiError(401, i18n.__("unauthorized")));
                }

                // assign the decoded token to the request
                req.sub = decoded;

                next();
            }
        );
    } catch (error) {
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authenticate;
