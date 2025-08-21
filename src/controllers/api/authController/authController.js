import i18n from "i18n";
import apiError from "../../../utils/api/apiError.js";
import apiResponse from "../../../utils/api/apiResponse.js";
import getModel from "../../../helpers/modelMap/modelMap.js";
import duplicate from "../../../helpers/auth/duplicate.js";
import admin from "firebase-admin";
import * as sendVerification from "../../../helpers/auth/sendVerification.js";
import * as devices from "../../../helpers/auth/devices.js";
import * as tokens from "../../../helpers/auth/tokens.js";
import * as userAvatars from "../../../helpers/user/avatars.js";
import * as otps from "../../../helpers/auth/otps.js";
import afterAuth from "../../../helpers/auth/afterAuth.js";
import { generateCsrfToken } from "../../../utils/csrf/csrfConfig.js";
import { validateCountryExists } from "../../../helpers/country/validateCountry.js";
import {
    userObj,
    userWithTokenObj,
} from "../../../utils/returnObject/returnObject.js";

export const getCsrfToken = (req, res) => {
    const token = generateCsrfToken(req, res);
    res.send(apiResponse(200, i18n.__("tokenGenerated"), { token }));
};

export const signUp = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // check for duplicate email
        if (data.email) {
            const isDuplicate = await duplicate(model, "email", data.email);
            if (isDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
            }
        }

        // check for duplicate phone
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

        // validate country if exists
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

        // set dataCompleted as true
        data.dataCompleted = true;

        // generate a user token
        const token = await afterAuth(
            id,
            data.type,
            data.fcmToken,
            data.deviceType
        );

        const user = await model.create({ _id: id, ...data });
        await user.populate("country");
        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulSignup"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const requestOtpEmail = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // generate and send OTP
        const otp = await sendVerification.sendVerificationByEmail(
            user.email,
            "otpSentEmail",
            "otpSentEmailText",
            "otpSentEmailHtml"
        );

        // store OTP for user
        otps.setOtp(user, otp);
        await user.save();

        res.send(apiResponse(200, i18n.__("otpSent"), { email: user.email }));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const requestOtpPhone = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // find user by phone
        const user = await model.findOne({
            phone: data.phone,
            status: "active",
        });
        if (!user) {
            return res.status(400).send(apiError(400, i18n.__("userNotFound")));
        }

        // generate and send OTP
        const { otp, smsResponse } =
            await sendVerification.sendVerificationBySMS(
                user.phone,
                "otpSentSms"
            );

        if (!smsResponse) {
            return res.status(500).send(apiError(500, i18n.__("smsNotSent")));
        }

        // store OTP for user
        otps.setOtp(user, otp);
        await user.save();

        res.send(apiResponse(200, i18n.__("otpSent"), { phone: user.phone }));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const localSignIn = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
            isVerified: true,
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

        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulLogin"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const socialSignIn = async (req, res) => {
    try {
        const data = req.body;

        // Verify Firebase ID token
        const decoded = await admin.auth().verifyIdToken(data.idToken);

        // Extract info from Firebase token
        const { uid, email, name, picture } = decoded;

        const model = getModel(data.type);

        let isNew = false;

        // Try to find user by Firebase UID
        let user = await model.findOne({ uId: uid });

        if (!user) {
            isNew = true;
            // Create new user with limited info (to be completed later)
            user = await model.create({
                firebaseUid: uid,
                email: email || "",
                name: name || "",
                avatar: picture || "",
                dataCompleted: false,
                isVerified: true,
            });
        }

        // Generate own JWT
        const token = await afterAuth(
            user._id,
            user.type,
            data.fcmToken,
            data.deviceType
        );

        // populate the country field if the user is new (pre hook wont work)
        if (isNew) await user.populate("country");
        const resData = userWithTokenObj(user, token);

        res.send(apiResponse(200, i18n.__("successfulLogin"), resData));
    } catch (error) {
        console.log(error);
        res.status(401).send(apiError(401, i18n.__("invalidFirebaseToken")));
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by email and activation code
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

export const verifyPhone = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by phone and activation code
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
        const { sub } = req;
        const data = req.body;

        const model = getModel(sub.userType);

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

        const resData = userObj(user);

        res.send(apiResponse(200, i18n.__("userUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const signOut = async (req, res) => {
    try {
        const { id } = req.sub;

        // Invalidate user tokens
        await tokens.deleteAllUserTokens(id);

        // Delete user devices
        await devices.deleteAllUserDevices(id);

        res.send(apiResponse(200, i18n.__("userSignedOut")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const resetPasswordEmail = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by email
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

        otps.resetOtp(user);
        user.password = data.password;
        await user.save();

        // Invalidate user tokens
        await tokens.deleteAllUserTokens(user.id);

        // Delete user devices
        await devices.deleteAllUserDevices(user.id);

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const resetPasswordPhone = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by phone
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

        otps.resetOtp(user);
        user.password = data.password;
        await user.save();

        // Invalidate user tokens
        await tokens.deleteAllUserTokens(user.id);

        // Delete user devices
        await devices.deleteAllUserDevices(user.id);

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
