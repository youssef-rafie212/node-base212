import admin from "firebase-admin";

import { Settings, Device, Notification } from "../../models/index.js";
import { sharedVariable, returnObject } from "../../utils/index.js";
import { getModel } from "../../helpers/index.js";

// handles notifications for different users and scenarios
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
        // get app settings
        const setting = await Settings.findOne({});

        // create notification settings object
        const objSetting = {
            image: sharedVariable.settingImage + setting.logo,
            title: setting.appTitle,
        };

        // create notification object
        const objNotify = returnObject.notifyObj(
            objUsers,
            objSetting,
            objMessage,
            objTitle || objSetting.title,
            key,
            lang,
            data
        );

        // save notification to database
        await saveNotification(objNotify);

        // get model based on type
        const model = getModel(objUsers.userRef);

        if (!model) {
            return;
        }

        // get the receiver document
        const user = await model.findOne({
            _id: objUsers.userId,
            status: "active",
            isNotify: true,
        });

        if (user) {
            // get receiver devices
            const devices = await Device.find({
                user: objUsers.userId,
                deviceType: { $in: ["android", "ios", "web"] },
            });

            // send notifications to all receiver devices
            await Promise.all(
                devices.map((device) => {
                    // create notification sending object for each device
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

                    // send the notification
                    return sendNotification(objSendNotify, device.deviceType);
                })
            );
        }
    } catch (error) {
        console.error("Error handling notification:", error);
    }
};

// saves the notification to the database
const saveNotification = async (objNotify) => {
    try {
        // create a new notification document
        const notification = await Notification.create(objNotify);

        // update receiver notification count
        const updateField = { $inc: { notifyCount: 1 } };

        // get model based on type
        const model = getModel(objNotify.userRef);

        if (!model) {
            return;
        }

        await model.findOneAndUpdate(
            { _id: notification.user, status: "active" },
            updateField,
            { new: true }
        );
    } catch (error) {
        console.error("Error saving notification:", error);
    }
};

// sends a notification using firebase admin
const sendNotification = async (objSendNotify, deviceType) => {
    try {
        const message = {
            token: objSendNotify.token, // for a single device
            notification: {
                title: objSendNotify.notification.title,
                body: objSendNotify.notification.body,
            },
            data: objSendNotify.data, // custom data for all platforms
        };

        console.log("FCM TOKEN:", objSendNotify.token);

        // add platform-specific options
        if (deviceType === "ios") {
            message.apns = {
                payload: {
                    aps: {
                        sound: "default",
                        badge: Number(objSendNotify.data.badge), // badge for ios notifyCount of user
                    },
                },
            };
        } else if (deviceType === "android") {
            message.android = {
                notification: {
                    sound: "default",
                    channelId: "default_channel", // ensure the app has a default notification channel
                },
                data: {
                    badge: objSendNotify.data.badge, // add badge as part of custom data (notifyCount of user)
                },
            };
        } else if (deviceType === "web") {
            message.webpush = {
                headers: {
                    Urgency: "high",
                },
                notification: {
                    icon: "fcm_push_icon",
                    click_action:
                        sharedVariable.address + objSendNotify.data.url,
                },
            };
        }

        console.log("Message:", message);

        // send the notification
        const response = await admin.messaging().send(message);
        console.log("Notification sent successfully:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
