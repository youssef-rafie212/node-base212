export const setOtp = (data, otp) => {
    data.activationCode = otp;
    data.activationExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
};

export const resetOtp = (data) => {
    data.activationCode = "";
    data.activationExpiresAt = null;
};

export const isOtpValid = (data, otp) => {
    if (!data.activationCode || !data.activationExpiresAt) return false;
    const isValid = data.activationCode === otp;
    const isExpired = Date.now() > data.activationExpiresAt;
    return isValid && !isExpired;
};
