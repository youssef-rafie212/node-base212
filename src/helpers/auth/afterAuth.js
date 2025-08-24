import * as devices from "./devices.js";
import * as tokens from "./tokens.js";

// handle post authentication actions
const afterAuth = async (
    userId,
    userType,
    fcmToken,
    deviceType = "android"
) => {
    // generate and store jwt token
    const token = await tokens.newToken(userId, userType);

    // add the user device to stored devices
    if (fcmToken) {
        await devices.addUserDevice(userId, fcmToken, deviceType);
    }

    return token;
};

export default afterAuth;
