import i18n from "i18n";

import { User } from "../../models/index.js";
import {
    getModel,
    duplicate,
    validateCountryExists,
    userAvatars,
    afterAuth,
} from "../../helpers/index.js";
import { apiError, apiResponse, returnObject } from "../../utils/index.js";

// creates a new user
export const createUser = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(model, "email", data.email);
            if (isDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
            }
        }

        // check for duplicate phone if it exists in body
        if (data.phone) {
            const isPhoneDuplicate = await duplicate(
                model,
                "phone",
                data.phone
            );
            if (isPhoneDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("phoneExists")));
            }
        }

        // validate country if it exists in body
        if (data.country) {
            const isCountryValid = await validateCountryExists(data.country);
            if (!isCountryValid) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("invalidCountry")));
            }
        }

        // handle avatar upload if it exists in the request
        const id = await userAvatars.uploadAvatar(req, data);

        // set dataCompleted as true (no complete data step)
        data.dataCompleted = true;

        // create new user
        const user = await model.create({ _id: id, ...data });

        // populate wanted fields (pre, post hooks wont work here)
        await user.populate("country");

        // get formated user object
        const resData = returnObject.userObj(user);

        res.send(apiResponse(200, i18n.__("documentCreated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
