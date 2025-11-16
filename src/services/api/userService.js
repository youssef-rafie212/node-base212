import i18n from "i18n";

import { returnObject, fileDelete } from "../../utils/index.js";
import {
    duplicate,
    validateCountryExists,
    userAvatars,
    tokens,
    devices,
    getModel,
} from "../../helpers/index.js";

export class UserService {
    async me(sub) {
        // get model based on type
        const model = getModel(sub.userType);

        // find the user
        const user = await model.findOne({ _id: sub.id, status: "active" });
        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // get a clean data
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async updatePassword(data, sub, currentToken) {
        // get model based on type
        const model = getModel(sub.userType);

        const user = await model.findOne({
            _id: sub.id,
            status: "active",
            isVerified: true,
            dataCompleted: true,
        });

        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // check if old password is correct
        const isPasswordMatch = await user.comparePassword(data.oldPassword);

        if (!isPasswordMatch) {
            return {
                error: i18n.__("invalidOldPassword"),
                data: null,
            };
        }

        // update password
        user.password = data.newPassword;
        await user.save();

        // delete other user tokens to force re-authentication
        await tokens.deleteAllUserTokensExceptCurrent(user.id, currentToken);

        // delete other user devices
        await devices.deleteAllUserDevices(user.id);

        return {
            error: null,
            data: {},
        };
    }

    async updateMe(data, sub, req) {
        // get model based on type
        const model = getModel(sub.userType);

        // find the user by id
        const user = await model.findOne({ _id: sub.id, status: "active" });
        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // unset isVerified if email or phone is being updated
        if (data.email || data.phone) {
            data.isVerified = false;
        }

        // handle avatar upload if it exists in the request
        await userAvatars.uploadAvatar(
            req,
            "users",
            data,
            true,
            req.sub.id,
            user.avatar
        );

        // dont allow updating password here
        if (data.password) delete data.password;

        // update user data
        Object.assign(user, data);
        await user.save();

        // get a clean data
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async deleteMe(sub) {
        // get model based on type
        const model = getModel(sub.userType);

        // find the user
        const user = await model.findOne({ _id: sub.id, status: "active" });
        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
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
        fileDelete.removeFile(user.avatar, "users", user.id);

        return {
            error: null,
            data: {},
        };
    }
}
