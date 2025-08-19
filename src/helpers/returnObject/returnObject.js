import i18n from "i18n";
import moment from "moment";
import momentTZ from "moment-timezone";
import { usersImage } from "../sharedVariable/sharedVariable.js";

export const objNotify = (
    objUser,
    objSetting,
    objMessage,
    objTitle,
    key,
    lang,
    data
) => {
    return {
        userId: objUser.userId,
        notifyId: objUser.notifyId,
        userRef: objUser.userRef,
        notifyRef: objUser.notifyRef,
        adminId: objUser.adminId,
        message: objMessage,
        title: objTitle,
        key,
        data: data || {}, // Store any additional data
    };
};

export const objSendNotify = (
    deviceToken,
    objSetting,
    objMessage,
    objTitle,
    key,
    counter,
    lang = "ar",
    data
) => {
    i18n.setLocale(lang); // Set the appropriate language

    // Sanitize and convert all `data` values to strings
    const sanitizedData = {};
    Object.entries(data || {}).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            sanitizedData[key] = "";
        } else if (typeof value === "object") {
            // For objects, stringify them
            sanitizedData[key] = JSON.stringify(value);
        } else {
            // For primitives, convert to string
            sanitizedData[key] = String(value);
        }
    });

    // Attach any additional data to the notification
    const attach = {
        name: sanitizedData.name,
    };

    const title =
        key === "admin" ? `${objTitle[lang]}` : objSetting.title[lang];

    const body =
        key === "admin"
            ? `${objMessage[lang]}`
            : i18n.__(objMessage[lang], attach);

    return {
        // Displayed notification content
        notification: {
            title,
            body,
        },

        // Token for the recipient device
        token: deviceToken,

        // Custom data for internal processing
        data: {
            key,
            sound: "default",
            badge: String(counter || 1), // Firebase requires strings for badge
            ...sanitizedData, // Spread the sanitized data directly
        },
    };
};
