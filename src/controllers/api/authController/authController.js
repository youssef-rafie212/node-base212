import i18n from "i18n";
import apiError from "../../../helpers/api/apiError.js";
import apiResponse from "../../../helpers/api/apiResponse.js";
import getModel from "../../../helpers/modelMap/modelMap.js";
import generateJwt from "../../../helpers/token/generateJwt.js";
import UserToken from "../../../models/userToken.js";
import Device from "../../../models/deviceModel.js";
import sendEmail from "../../../services/nodemailer/sendEmail.js";
import sendSms from "../../../services/sendSMS/sendSMS.js";
import * as codeGeneration from "../../../utils/generateCode/generateCode.js";
import duplicate from "../../../helpers/user/duplicate.js";
import makeDir from "../../../helpers/makeDir/makeDir.js";
import initId from "../../../utils/initIds/initId.js";
import { uploadAnyFile } from "../../../helpers/fileUpload/fileUpload.js";
import admin from "firebase-admin";
import serviceAccount from "../../../../config/firebase.json";
import * as sendVerification from "../../../helpers/user/sendVerification.js";
import * as devices from "../../../helpers/user/devices.js";

export const signUp = async (req, res) => {
    try {
        const data = req.body;

        // get model based on type
        const model = getModel(data.type);

        // check for duplicate email
        if (data.email) {
            const isDuplicate = await duplicate(model, "email", data.email);
            if (isDuplicate) {
                return res.send(apiError(400, i18n.__("emailExists")));
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
                return res.send(apiError(400, i18n.__("phoneExists")));
            }
        }

        // handle file uploads
        const id = initId();
        if (req.files?.avatar) {
            const dir = makeDir(`users/${id}`);
            const image = await uploadAnyFile(
                req,
                "image",
                dir,
                "avatar",
                500,
                500
            );
            data.avatar = image;
        }

        // set dataCompleted as true
        data.dataCompleted = true;

        // generate a user token
        const token = generateJwt(id, data.type);
        await UserToken.create({ userId: id, token, userRef: data.type });

        // add the user device to stored devices
        if (data.fcmToken) {
            await devices.addUserDevice(
                id,
                data.fcmToken,
                data.type,
                data.deviceType
            );
        }

        let otp = "";
        // send otp sms for phone verification
        if (data.phone) {
            otp = await sendVerification.sendVerificationBySMS(
                data.phone,
                "phoneVerificationSms"
            );
        }

        // send otp email for email verification
        if (data.email) {
            otp = await sendVerification.sendVerificationByEmail(
                data.email,
                "emailVerificationEmail",
                "emailVerificationEmailText",
                "emailVerificationEmailHtml"
            );
        }

        // store otp for user
        data.activationCode = otp;

        const user = await model.create({ _id: id, ...data });

        res.send(
            apiResponse(200, i18n.__("successfulSignup"), {
                userId: user._id,
                token,
            })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const localSignIn = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
        });
        if (!user) {
            return res.send(apiError(404, i18n.__("invalidCredentials")));
        }

        // Check password
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            return res.send(apiError(401, i18n.__("invalidCredentials")));
        }

        // Generate token
        const token = generateJwt(user.id, data.type);
        await UserToken.create({
            userId: user.id,
            token,
            userRef: data.type,
        });

        // add the user device to stored devices
        if (data.fcmToken) {
            await devices.addUserDevice(
                user._id,
                data.fcmToken,
                data.type,
                data.deviceType
            );
        }

        res.send(
            apiResponse(200, i18n.__("successfulLogin"), {
                userId: user._id,
                token,
            })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const socialSignIn = async (req, res) => {
    try {
        const data = req.body;

        // Initialize Firebase Admin SDK if not already initialized
        if (!admin.apps.length) {
            // Path to your Firebase config
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }

        // Verify Firebase ID token
        const decoded = await admin.auth().verifyIdToken(data.idToken);

        // Extract info from Firebase token
        const { uid, email, name, picture } = decoded;

        const model = getModel(data.type);

        // Try to find user by Firebase UID
        let user = await model.findOne({ uId: uid });

        if (!user) {
            // Create new user with limited info (to be completed later)
            user = await model.create({
                firebaseUid: uid,
                email: email || "",
                name: name || "",
                avatar: picture || "",
                dataCompleted: false,
            });
        }

        // Generate your own JWT for session
        const token = generateJwt(user.id, data.type);
        await UserToken.create({ userId: user.id, token, userRef: data.type });

        // Store device
        if (data.fcmToken) {
            await devices.addUserDevice(
                user._id,
                data.fcmToken,
                data.type,
                data.deviceType
            );
        }

        res.send(
            apiResponse(200, i18n.__("successfulLogin"), {
                userId: user._id,
                token,
                dataCompleted: user.dataCompleted,
            })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(401, i18n.__("invalidFirebaseToken")));
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
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        if (user.activationCode !== data.otp) {
            return res.send(apiError(404, i18n.__("invalidOtp")));
        }

        // Activate user
        user.activationCode = "";
        user.isVerified = true;
        await user.save();

        res.send(
            apiResponse(200, i18n.__("userVerified"), { userId: user._id })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
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
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        if (user.activationCode !== data.otp) {
            return res.send(apiError(404, i18n.__("invalidOtp")));
        }

        // Activate user
        user.activationCode = "";
        user.isVerified = true;
        await user.save();

        res.send(
            apiResponse(200, i18n.__("userVerified"), { userId: user._id })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// handler for completing the user data after a social login as it only provides limitied data
export const completeData = async (req, res) => {
    try {
        const data = req.data;

        const model = getModel(data.type);

        const user = await model.findById(data.id);

        if (!user) {
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        // set dataCompleted as true
        data.dataCompleted = true;

        // Update user data
        Object.assign(user, data);
        await user.save();

        res.send(
            apiResponse(200, i18n.__("userUpdated"), { userId: user._id })
        );
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const signOut = async (req, res) => {
    try {
        const { id } = req.sub;

        // Invalidate user token
        await UserToken.deleteMany({ userId: id });

        // Delete user devices
        await Device.deleteMany({ userId: id });

        res.send(apiResponse(200, i18n.__("userSignedOut")));
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const forgotPasswordEmail = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by email
        const user = await model.findOne({
            email: data.email,
            status: "active",
        });
        if (!user) {
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        // Send reset otp to email
        const otp = codeGeneration.generateOtp();
        await sendEmail({
            to: data.email,
            subject: i18n.__("passwordResetEmail"),
            text: i18n.__("passwordResetEmailText", { otp }),
            html: i18n.__("passwordResetEmailHtml", { otp }),
        });

        user.verificationCode = otp;
        await user.save();

        res.send(apiResponse(200, i18n.__("passwordResetEmailSent")));
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};

export const forgotPasswordPhone = async (req, res) => {
    try {
        const data = req.body;

        const model = getModel(data.type);

        // Find user by phone
        const user = await model.findOne({
            phone: data.phone,
            status: "active",
        });
        if (!user) {
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        // Send reset otp to phone
        const otp = codeGeneration.generateOtp();
        await sendSms(data.phone, i18n.__("passwordResetSms", { otp }));

        user.verificationCode = otp;
        await user.save();

        res.send(apiResponse(200, i18n.__("passwordResetSmsSent")));
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
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
        });
        if (!user) {
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        // verify the otp
        if (user.verificationCode !== data.otp) {
            return res.send(apiError(400, i18n.__("invalidOtp")));
        }

        user.password = data.password;
        user.verificationCode = "";
        await user.save();

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
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
        });
        if (!user) {
            return res.send(apiError(404, i18n.__("userNotFound")));
        }

        // verify the otp
        if (user.verificationCode !== data.otp) {
            return res.send(apiError(400, i18n.__("invalidOtp")));
        }

        user.password = data.password;
        user.verificationCode = "";
        await user.save();

        res.send(apiResponse(200, i18n.__("passwordResetSuccessfully")));
    } catch (error) {
        console.log(error);
        res.send(apiError(500, i18n.__("returnDeveloper")));
    }
};
