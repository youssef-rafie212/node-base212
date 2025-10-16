import { Device } from "../../models/index.js";

// stores new user devices
export const addUserDevice = async (
    userId,
    fcmToken,
    deviceType = "android"
) => {
    // check if the device already exists first
    const existingDevice = await Device.findOne({ user: userId, fcmToken });
    if (!existingDevice) {
        await Device.create({
            user: userId,
            fcmToken,
            deviceType,
        });
    }
};

// deletes all user devices
export const deleteAllUserDevices = async (userId) => {
    await Device.deleteMany({ user: userId });
};

// deletes all user devices except current one
export const deleteAllUserDevicesExceptCurrent = async (
    userId,
    currentDeviceFcmToken
) => {
    await Device.deleteMany({
        user: userId,
        fcmToken: { $ne: currentDeviceFcmToken },
    });
};
