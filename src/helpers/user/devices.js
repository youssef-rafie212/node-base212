import Device from "../../models/deviceModel.js";

export const addUserDevice = async (
    userId,
    fcmToken,
    userRef,
    deviceType = "android"
) => {
    await Device.create({
        userId,
        fcmToken,
        userRef,
        deviceType,
    });
};
