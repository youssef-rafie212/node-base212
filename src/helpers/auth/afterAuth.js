import * as devices from "./devices.js";
import * as tokens from "./tokens.js";

const afterAuth = async (
    userId,
    userType,
    fcmToken,
    deviceType = "android"
) => {
    // generate token
    const token = await tokens.newToken(userId, userType);

    // add the user device to stored devices
    if (fcmToken) {
        await devices.addUserDevice(userId, fcmToken, userType, deviceType);
    }

    return token;
};

export default afterAuth;
