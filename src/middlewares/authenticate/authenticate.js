import jwt from "jsonwebtoken";
import UserToken from "../../models/userToken.js";
import i18n from "i18n";
import apiError from "../../utils/api/apiError.js";
import getModel from "../../helpers/modelMap/modelMap.js";

const authenticate = (req, res, next) => {
    try {
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

                // validate user
                const { userType } = decoded;
                const model = getModel(userType);
                const user = await model.findById(decoded.id);
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

                req.sub = decoded;
                next();
            }
        );
    } catch (error) {
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export default authenticate;
