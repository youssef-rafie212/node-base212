import { sendVerification } from "../index.js";

// send otp by email or phone
export const sendOtpWithIdentifier = async (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    let otp = null;

    if (emailRegex.test(identifier))
        otp = await sendVerification.sendVerificationByEmail(
            identifier,
            "otpSentEmail",
            "otpSentEmailText",
            "otpSentEmailHtml"
        );
    else if (phoneRegex.test(identifier))
        otp = await sendVerification.sendVerificationBySMS(identifier);
    else return null;

    return otp;
};
