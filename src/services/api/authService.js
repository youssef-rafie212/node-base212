import i18n from "i18n";
import admin from "firebase-admin";

import { returnObject } from "../../utils/index.js";
import {
    getModel,
    devices,
    tokens,
    userAvatars,
    otps,
    afterAuth,
    getUserWithIdentifier,
} from "../../helpers/index.js";
import { sendOtpWithIdentifier } from "../../helpers/auth/sendOtpWithIdentifier.js";

export class AuthService {
    async signup(data, req) {
        // get model based on type
        const model = getModel(data.type);

        // handle avatar upload if it exists in the request
        const id = await userAvatars.uploadAvatar(req, "users", data);

        // set dataCompleted as true (no complete data step)
        data.dataCompleted = true;

        data.expireAt = new Date(Date.now() + 60 * 60 * 1000);

        // generate user token and store user device
        const token = await afterAuth(
            { id, userType: data.type },
            data.fcmToken,
            data.deviceType
        );

        // create new user
        const user = await model.create({ _id: id, ...data });

        // populate wanted fields (pre, post hooks wont work here)
        await user.populate("country");

        // get a clean formated object to return in the response
        const resData = returnObject.userWithTokenObj(user, token);

        return {
            error: null,
            data: resData,
        };
    }

    async requestOtp(data) {
        // get model based on type
        const model = getModel(data.type);

        const user = await getUserWithIdentifier(model, data.identifier);

        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        const otp = await sendOtpWithIdentifier(data.identifier);

        otps.setOtp(user, otp);

        await user.save();

        return {
            error: null,
            data: {},
        };
    }

    async verifyOtp(data) {
        // get model based on type
        const model = getModel(data.type);

        const user = await getUserWithIdentifier(model, data.identifier);

        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // validate the otp
        const validOtp = otps.isOtpValid(user, data.otp);

        if (!validOtp) {
            return {
                error: i18n.__("invalidOtp"),
                data: null,
            };
        }

        // update the user based on the reason
        if (data.reason === "verify") {
            user.isVerified = true;
            await model.updateOne(
                { _id: user._id },
                { $unset: { expireAt: "" } }
            );
        } else if (data.reason === "reset") {
            user.canReset = true;
        }

        otps.resetOtp(user);

        await user.save();

        return {
            error: null,
            data: {},
        };
    }

    async localSignIn(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by email or phone
        const user = await getUserWithIdentifier(model, data.identifier);

        if (!user) {
            return {
                error: i18n.__("invalidCredentials"),
                data: null,
            };
        }

        // check password
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            return {
                error: i18n.__("invalidCredentials"),
                data: null,
            };
        }

        // create a retry token in case of not completed data or unverified account,
        // so the user can continue to complete data or verify account
        const retryToken = await tokens.newToken({
            id: user.id,
            userType: data.type,
        });

        // check if user is not verified
        if (!user.isVerified) {
            return {
                error: i18n.__("accountNotVerified"),
                key: "NOT_VERIFIED",
                retryToken,
                data: null,
            };
        }

        // check if user complelted data
        if (!user.dataCompleted) {
            return {
                error: i18n.__("dataNotCompleted"),
                key: "NOT_COMPLETED",
                retryToken,
                data: null,
            };
        }

        // generate token
        const token = await afterAuth(
            {
                id: user.id,
                userType: data.type,
            },
            data.fcmToken,
            data.deviceType
        );

        // get a clean formated object to return in the response
        const resData = returnObject.userWithTokenObj(user, token);

        return {
            error: null,
            data: resData,
        };
    }

    async socialSignIn(data) {
        // verify firebase ID token
        const decoded = await admin.auth().verifyIdToken(data.idToken);

        // extract info from firebase token
        const { uid, email, name, picture } = decoded;

        // get model based on type
        const model = getModel(data.type);

        // track if the user is new or existing
        let isNew = false;

        // try to find user by Firebase UID
        let user = await model.findOne({ uId: uid, status: "active" });

        if (!user) {
            // create new user with limited info (to be completed later)
            isNew = true;
            user = await model.create({
                firebaseUid: uid,
                email: email || "",
                name: name || "",
                avatar: picture || "",
                dataCompleted: false,
                isVerified: true,
            });
        }

        // generate own JWT
        const token = await afterAuth(
            {
                id: user.id,
                userType: user.type,
            },
            data.fcmToken,
            data.deviceType
        );

        // populate the country field if the user is new (pre, post hook wont work)
        if (isNew) await user.populate("country");

        // get a clean formated object to return in the response
        const resData = returnObject.userWithTokenObj(user, token);

        return {
            error: null,
            data: resData,
        };
    }

    async completeData(data, sub, req) {
        // get model based on type
        const model = getModel(sub.userType);

        // get the user document
        const user = await model.findOne({
            _id: sub.id,
            status: "active",
            isVerified: true,
        });
        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // check if user already completed data
        if (user.dataCompleted) {
            return {
                error: i18n.__("dataAlreadyCompleted"),
                data: null,
            };
        }

        // handle avatar upload if it exists in the request
        await userAvatars.uploadAvatar(req, "users", data, user._id);

        // set dataCompleted as true
        data.dataCompleted = true;

        // Update user data
        Object.assign(user, data);
        await user.save();

        // get a clean formated object to return in the response
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async signOut(id) {
        // delete user tokens
        await tokens.deleteAllUserTokens(id);

        // delete user devices
        await devices.deleteAllUserDevices(id);

        return {
            error: null,
            data: {},
        };
    }

    async resetPassword(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by identifier
        const user = await getUserWithIdentifier(model, data.identifier, {
            canReset: true,
        });

        if (!user) {
            return {
                error: i18n.__("userNotFound"),
                data: null,
            };
        }

        // update the user's password
        user.password = data.password;
        user.canReset = false;
        await user.save();

        // delete user tokens to force re-authentication
        await tokens.deleteAllUserTokens(user.id);

        // delete user devices
        await devices.deleteAllUserDevices(user.id);

        return {
            error: null,
            data: {},
        };
    }
}
