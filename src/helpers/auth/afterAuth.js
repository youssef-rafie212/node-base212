import { tokens, devices } from "../index.js";

// handle post authentication actions
const afterAuth = async (payload, fcmToken, deviceType = "android") => {
    // generate and store jwt token
    const token = await tokens.newToken(payload);

    // add the user device to stored devices
    if (fcmToken) {
        await devices.addUserDevice(payload.id, fcmToken, deviceType);
    }

    return token;
};

export default afterAuth;
