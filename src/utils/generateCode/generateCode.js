import crypto from "crypto";

// generate a random otp
export const generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp;
};
