// sets OTP related fields to given data object
export const setOtp = (data, otp) => {
    data.activationCode = otp;
    data.activationExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
};

// resets OTP related fields in the given data object
export const resetOtp = (data) => {
    data.activationCode = "";
    data.activationExpiresAt = null;
};

// checks if given otp is valid
export const isOtpValid = (data, otp) => {
    if (!data.activationCode || !data.activationExpiresAt) return false;
    const isValid = data.activationCode === otp;
    const isExpired = Date.now() > data.activationExpiresAt;
    return isValid && !isExpired;
};
