import jwt from "jsonwebtoken";
import i18n from "i18n";

import UserToken from "../../models/userToken.js";
import apiError from "../../utils/api/apiError.js";
import getModel from "../../helpers/modelMap/modelMap.js";

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
                    return res.send(apiError(401, i18n.__("unauthorized")));
                }

                // get model based on user type
                const { userType } = decoded;
                const model = getModel(userType);

                // find user by id
                const user = await model.findById(decoded.id);

                // validate the user
                if (!user || user.status !== "active" || !user.isVerified) {
                    return res.send(apiError(401, i18n.__("unauthorized")));
                }

                // check if the token exists in the database
                const userToken = await UserToken.findOne({
                    token,
                    userId: decoded.id,
                });
                if (!userToken) {
                    return res.send(apiError(401, i18n.__("unauthorized")));
                }

                // assign the decoded token to the request
                req.sub = decoded;

                next();
            }
        );
    } catch (error) {
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authenticate;
