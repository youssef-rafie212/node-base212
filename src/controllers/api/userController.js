import i18n from "i18n";

import { userObj } from "../../utils/returnObject/returnObject.js";
import apiError from "../../utils/api/apiError.js";
import apiResponse from "../../utils/api/apiResponse.js";
import User from "../../models/userModel.js";
import duplicate from "../../helpers/auth/duplicate.js";
import { validateCountryExists } from "../../helpers/country/validateCountry.js";
import * as userAvatars from "../../helpers/user/avatars.js";
import * as tokens from "../../helpers/auth/tokens.js";
import * as devices from "../../helpers/auth/devices.js";
import { removeFile } from "../../utils/fileDelete/fileDelete.js";

// gets current user information
export const me = async (req, res) => {
    try {
        // find the user
        const user = await User.findOne({ _id: req.sub.id, status: "active" });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // get a clean data
        const resData = userObj(user);

        res.send(apiResponse(200, i18n.__("userFetched"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// update current user information
export const updateMe = async (req, res) => {
    try {
        const data = req.validatedData;

        // find the user by id
        const user = await User.findOne({ _id: req.sub.id, status: "active" });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // check for duplicate email if it exists in body
        if (data.email && user.email !== data.email) {
            const isDuplicate = await duplicate(
                "email",
                data.email,
                req.sub.id
            );
            if (isDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
            }

            // unverify the user
            data.isVerified = false;
        }

        // check for duplicate phone if it exists in body
        if (data.phone && user.phone !== data.phone) {
            const isPhoneDuplicate = await duplicate(
                "phone",
                data.phone,
                req.sub.id
            );
            if (isPhoneDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("phoneExists")));
            }

            // unverify the user
            data.isVerified = false;
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
        await userAvatars.uploadAvatar(
            req,
            data,
            true,
            req.sub.id,
            user.avatar
        );

        // update user data
        Object.assign(user, data);
        await user.save();

        // get a clean data
        const resData = userObj(user);

        res.send(apiResponse(200, i18n.__("userUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// change current user language
export const updateLanguage = async (req, res) => {
    try {
        const data = req.validatedData;

        // find the user by id
        const user = await User.findOne({ _id: req.sub.id, status: "active" });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // update user language
        user.language = data.language;
        await user.save();

        // get a clean data
        const resData = userObj(user);

        res.send(apiResponse(200, i18n.__("languageUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// delete current user account
export const deleteMe = async (req, res) => {
    try {
        // find the user
        const user = await User.findOne({ _id: req.sub.id, status: "active" });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // soft delete user account
        user.status = "deleted";
        // reset avatar
        user.avatar = "";
        await user.save();

        // soft delete related user data
        // ...

        // delete user tokens
        await tokens.deleteAllUserTokens(user.id);

        // delete user devices
        await devices.deleteAllUserDevices(user.id);

        // delete user avatar
        removeFile(user.avatar, "users", user.id);

        res.send(apiResponse(200, i18n.__("userDeleted")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
