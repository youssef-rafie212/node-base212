import admin from "firebase-admin";
import * as returnObject from "../../helpers/returnObject/returnObject.js";
import modelMap from "../../helpers/modelMap/modelMap.js";
import {
    settingImage,
    address,
} from "../../helpers/sharedVariable/sharedVariable.js";
import Setting from "../../models/settingsModel.js";
import Device from "../../models/deviceModel.js";
import Notification from "../../models/notificationModel.js";

/**
 * Handles notifications for different users and scenarios.
 */
export const handleNotification = async (
    objUsers,
    objMessage,
    objTitle,
    key,
    counter,
    lang,
    data
) => {
    try {
        const setting = await Setting.findOne({});
        const objSetting = {
            image: settingImage + setting.logo,
            title: setting.appTitle,
        };

        const objNotify = returnObject.notifyObj(
            objUsers,
            objSetting,
            objMessage,
            objTitle || objSetting.title,
            key,
            lang,
            data
        );

        await saveNotification(objNotify);

        const Model = modelMap(objUsers.userRef);
        const user = await Model.findOne(
            { _id: objUsers.userId },
            { isNotify: true }
        );

        if (user) {
            const devices = await Device.find({
                userId: objUsers.userId,
                deviceType: { $in: ["android", "ios", "web"] },
            });

            await Promise.all(
                devices.map((device) => {
                    const objSendNotify = returnObject.sendNotifyObj(
                        device.fcmToken,
                        objSetting,
                        objMessage,
                        objTitle,
                        key,
                        counter,
                        lang,
                        data
                    );

                    return sendNotification(objSendNotify, device.deviceType);
                })
            );
        }
    } catch (error) {
        console.error("Error handling notification:", error);
    }
};

/**
 * Saves the notification to the database.
 */
const saveNotification = async (objNotify) => {
    try {
        const notification = await Notification.create(objNotify);
        const updateField = { $inc: { notifyCount: 1 } };
        const model = modelMap(objNotify.userRef);

        await model.findOneAndUpdate(
            { _id: notification.userId },
            updateField,
            { new: true }
        );
    } catch (error) {
        console.error("Error saving notification:", error);
    }
};

/**
 * Sends a notification using Firebase Admin.
 */
const sendNotification = async (objSendNotify, deviceType) => {
    try {
        const message = {
            token: objSendNotify.token, // For a single device
            notification: {
                title: objSendNotify.notification.title,
                body: objSendNotify.notification.body,
            },
            data: objSendNotify.data, // Custom data for all platforms
        };

        // Add platform-specific options
        if (deviceType === "ios") {
            message.apns = {
                payload: {
                    aps: {
                        sound: "default",
                        badge: Number(objSendNotify.data.badge), // Badge for iOS notifyCount of user
                    },
                },
            };
        } else if (deviceType === "android") {
            message.android = {
                notification: {
                    sound: "default",
                    channelId: "default_channel", // Ensure the app has a default notification channel
                },
                data: {
                    badge: objSendNotify.data.badge, // Add badge as part of custom data (notifyCount of user)
                },
            };
        } else if (deviceType === "web") {
            message.webpush = {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    icon: "fcm_push_icon",
                    click_action: address + objSendNotify.data.url,
                },
            };
        }

        const response = await admin.messaging().send(message);
        console.log("Notification sent successfully:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
