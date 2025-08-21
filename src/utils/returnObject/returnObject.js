import i18n from "i18n";
import moment from "moment";
import {
    usersImage,
    address,
    countryImage,
} from "../sharedVariable/sharedVariable.js";

export const userObj = (user) => {
    console.log("env", process.env.NODE_ENV);
    const avatar =
        user.avatar == "" || user.avatar == "default.png"
            ? address + usersImage + "default.png"
            : user.avatar.startsWith("http") // handle social login pictures
            ? user.avatar
            : address + usersImage + user.id + "/" + user.avatar;

    return {
        id: user._id,
        uId: user.uId || null,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar,
        type: user.type,
        status: user.status,
        gender: user.gender,
        language: user.language,
        dataCompleted: user.dataCompleted,
        country: countryObj(user.country),
    };
};

export const userWithTokenObj = (user, token) => {
    return {
        token,
        user: userObj(user),
    };
};

export const countryObj = (country) => {
    const image = address + countryImage + country.image;
    return {
        id: country._id,
        name: country.name,
        image,
    };
};

export const notifyObj = (
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

export const sendNotifyObj = (
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
