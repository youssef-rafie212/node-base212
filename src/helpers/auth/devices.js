import { Device } from "../../models/index.js";

// stores new user devices
export const addUserDevice = async (
    userId,
    fcmToken,
    deviceType = "android"
) => {
    // check if the device already exists first
    const existingDevice = await Device.findOne({ userId, fcmToken });
    if (!existingDevice) {
        await Device.create({
            userId,
            fcmToken,
            deviceType,
        });
    }
};

// deletes all user devices
export const deleteAllUserDevices = async (userId) => {
    await Device.deleteMany({ userId });
};
