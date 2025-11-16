import { sendVerification } from "../index.js";
import { getTypeWithIdentifier } from "./getTypeWithIdentifier.js";

// send otp by email or phone
export const sendOtpWithIdentifier = async (identifier) => {
    const type = getTypeWithIdentifier(identifier);

    let otp = null;

    if (type === "email")
        otp = await sendVerification.sendVerificationByEmail(
            identifier,
            "otpSentEmail",
            "otpSentEmailText",
            "otpSentEmailHtml"
        );
    else if (type === "phone")
        otp = await sendVerification.sendVerificationBySMS(identifier);

    return otp;
};
