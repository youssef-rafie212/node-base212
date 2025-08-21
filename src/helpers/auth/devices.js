import Device from "../../models/deviceModel.js";

export const addUserDevice = async (
    userId,
    fcmToken,
    userRef,
    deviceType = "android"
) => {
    // check if the device already exists first
    const existingDevice = await Device.findOne({ userId, fcmToken });
    if (!existingDevice) {
        await Device.create({
            userId,
            fcmToken,
            userRef,
            deviceType,
        });
    }
};

export const deleteAllUserDevices = async (userId) => {
    await Device.deleteMany({ userId });
};
