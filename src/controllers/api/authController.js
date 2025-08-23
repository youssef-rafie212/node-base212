import i18n from "i18n";
import apiError from "../../utils/api/apiError.js";
import apiResponse from "../../utils/api/apiResponse.js";
import getModel from "../../helpers/modelMap/modelMap.js";
import duplicate from "../../helpers/auth/duplicate.js";
import admin from "firebase-admin";

import * as sendVerification from "../../helpers/auth/sendVerification.js";
import * as devices from "../../helpers/auth/devices.js";
import * as tokens from "../../helpers/auth/tokens.js";
import * as userAvatars from "../../helpers/user/avatars.js";
import * as otps from "../../helpers/auth/otps.js";
import afterAuth from "../../helpers/auth/afterAuth.js";
import { generateCsrfToken } from "../../utils/csrf/csrfConfig.js";
import { validateCountryExists } from "../../helpers/country/validateCountry.js";
import {
    userObj,
    userWithTokenObj,
} from "../../utils/returnObject/returnObject.js";

// generate a csrf token for the current request
export const getCsrfToken = (req, res) => {
    const token = generateCsrfToken(req, res);
    res.send(apiResponse(200, i18n.__("tokenGenerated"), { token }));
};

// local sign up for user with full data
export const signUp = async (req, res) => {
    try {
        const data = req.body;

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

        // generate user token and store user device
        const token = await afterAuth(
            id,
            data.type,
            data.fcmToken,
            data.deviceType
        );

        // create new user
        const user = await model.create({ _id: id, ...data });

        // populate wanted fields (pre, post hooks wont work here)
        await user.populate("country");

        // get a clean formated object to return in the response
        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulSignup"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// request an otp that will be sent on email
export const requestOtpEmail = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // generate and send otp
        const otp = await sendVerification.sendVerificationByEmail(
            user.email,
            "otpSentEmail",
            "otpSentEmailText",
            "otpSentEmailHtml"
        );

        // store otp for user
        otps.setOtp(user, otp);
        await user.save();

        res.send(apiResponse(200, i18n.__("otpSent"), { email: user.email }));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// request an otp that will be sent on phone
export const requestOtpPhone = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by phone
        const user = await model.findOne({
            phone: data.phone,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // generate and send otp
        const { otp, smsResponse } =
            await sendVerification.sendVerificationBySMS(
                user.phone,
                "otpSentSms"
            );

        // check if SMS was sent successfully
        if (!smsResponse) {
            return res.status(500).send(apiError(500, i18n.__("smsNotSent")));
        }

        // store otp for user
        otps.setOtp(user, otp);
        await user.save();

        res.send(apiResponse(200, i18n.__("otpSent"), { phone: user.phone }));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// local sign in
export const localSignIn = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
            isVerified: true, // make sure the user is verified
        });
        if (!user) {
            return res
                .status(401)
                .send(apiError(401, i18n.__("invalidCredentials")));
        }

        // check password
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            return res
                .status(401)
                .send(apiError(401, i18n.__("invalidCredentials")));
        }

        // generate token
        const token = await afterAuth(
            user._id,
            user.type,
            data.fcmToken,
            data.deviceType
        );

        // get a clean formated object to return in the response
        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulLogin"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// social sign in
export const socialSignIn = async (req, res) => {
    try {
        const data = req.body;

        // verify firebase ID token
        const decoded = await admin.auth().verifyIdToken(data.idToken);

        // extract info from firebase token
        const { uid, email, name, picture } = decoded;

        // get model based on type
        const model = getModel(data.type);

        // track if the user is new or existing
        let isNew = false;

        // try to find user by Firebase UID
        let user = await model.findOne({ uId: uid });

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
            user._id,
            user.type,
            data.fcmToken,
            data.deviceType
        );

        // populate the country field if the user is new (pre, post hook wont work)
        if (isNew) await user.populate("country");

        // get a clean formated object to return in the response
        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulLogin"), resData));
    } catch (error) {
        console.log(error);
        res.status(401).send(apiError(401, i18n.__("invalidFirebaseToken")));
    }
};

// verify user email by otp
export const verifyEmail = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by email and activation code
        const user = await model.findOne({
            email: data.email,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // check if user is already verified
        if (user.isVerified) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("alreadyVerified")));
        }

        // validate the otp
        const validOtp = otps.isOtpValid(user, data.otp);
        if (!validOtp) {
            return res.status(400).send(apiError(400, i18n.__("invalidOtp")));
        }

        // activate user
        otps.resetOtp(user); // reset otp
        user.isVerified = true;
        await user.save();

        res.send(
            apiResponse(200, i18n.__("userVerified"), { userId: user._id })
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// verify user phone by otp
export const verifyPhone = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by phone and activation code
        const user = await model.findOne({
            phone: data.phone,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // check if user is already verified
        if (user.isVerified) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("alreadyVerified")));
        }

        // validate the otp
        const validOtp = otps.isOtpValid(user, data.otp);
        if (!validOtp) {
            return res.status(400).send(apiError(400, i18n.__("invalidOtp")));
        }

        // Activate user
        otps.resetOtp(user); // reset otp
        user.isVerified = true;
        await user.save();

        res.send(
            apiResponse(200, i18n.__("userVerified"), { userId: user._id })
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// handler for completing the user data after a social login as it only provides limitied data
export const completeData = async (req, res) => {
    try {
        // get current signed in user
        const { sub } = req;

        const data = req.body;

        // get model based on type
        const model = getModel(sub.userType);

        // get the user document
        const user = await model.findOne({ _id: sub.id, status: "active" });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // check if user already completed data
        if (user.dataCompleted) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("dataAlreadyCompleted")));
        }

        // handle avatar upload if it exists in the request
        await userAvatars.uploadAvatar(req, data, user._id);

        // set dataCompleted as true
        data.dataCompleted = true;

        // Update user data
        Object.assign(user, data);
        await user.save();

        // get a clean formated object to return in the response
        const resData = userObj(user);

        res.send(apiResponse(200, i18n.__("userUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// sign out the user and clear their session related data
export const signOut = async (req, res) => {
    try {
        const { id } = req.sub;

        // delete user tokens
        await tokens.deleteAllUserTokens(id);

        // delete user devices
        await devices.deleteAllUserDevices(id);

        res.send(apiResponse(200, i18n.__("userSignedOut")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// reset password using email and otp
export const resetPasswordEmail = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
            isVerified: true,
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // verify the otp
        const validOtp = otps.isOtpValid(user, data.otp);
        if (!validOtp) {
            return res.status(400).send(apiError(400, i18n.__("invalidOtp")));
        }

        // reset the otp for user
        otps.resetOtp(user);

        // update the user's password
        user.password = data.password;
        await user.save();

        // delete user tokens to force re-authentication
        await tokens.deleteAllUserTokens(user.id);

        // delete user devices
        await devices.deleteAllUserDevices(user.id);

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// reset password using phone and otp
export const resetPasswordPhone = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // find user by phone
        const user = await model.findOne({
            phone: data.phone,
            status: "active",
            isVerified: true,
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // verify the otp
        const validOtp = otps.isOtpValid(user, data.otp);
        if (!validOtp) {
            return res.status(400).send(apiError(400, i18n.__("invalidOtp")));
        }

        // reset the otp for user
        otps.resetOtp(user);

        // update the user's password
        user.password = data.password;
        await user.save();

        // delete user tokens to force re-authentication
        await tokens.deleteAllUserTokens(user.id);

        // delete user devices
        await devices.deleteAllUserDevices(user.id);

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
