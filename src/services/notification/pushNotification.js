import admin from "firebase-admin";

import { Device } from "../../models/index.js";
import { sharedVariable, returnObject } from "../../utils/index.js";

// handles notifications for different users and scenarios
export const handleNotification = async (
    receiver,
    objTitle,
    objMessage,
    key,
    data,
    counter
) => {
    try {
        // get receiver devices
        const devices = await Device.find({
            user: receiver.id,
            deviceType: { $in: ["android", "ios", "web"] },
        });

        if (devices.length === 0) {
            return;
        }

        // send notifications to all receiver devices
        await Promise.all(
            devices.map((device) => {
                // create notification sending object for each device
                const objSendNotify = returnObject.sendNotifyObj(
                    device.fcmToken,
                    objTitle,
                    objMessage,
                    key,
                    data,
                    counter
                );

                // send the notification
                return sendNotification(objSendNotify, device.deviceType);
            })
        );

        // update notification count for the user
        receiver.notifyCount = counter;
        await receiver.save();
    } catch (error) {
        console.error("Error handling notification:", error);
    }
};

// sends a notification using firebase admin
const sendNotification = async (objSendNotify, deviceType) => {
    try {
        const message = {
            token: objSendNotify.token,
            notification: {
                title: objSendNotify.notification.title,
                body: objSendNotify.notification.body,
            },
            data: objSendNotify.data,
        };

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

        // send the notification
        const response = await admin.messaging().send(message);
        console.log("Notification sent successfully:", response);
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
