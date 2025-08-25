import i18n from "i18n";
import moment from "moment";

import { sharedVariable } from "../index.js";

moment.locale("ar"); // set default language

export const userObj = (user) => {
    const avatar =
        !user.avatar || user.avatar === "" || user.avatar === "default.png"
            ? sharedVariable.address + sharedVariable.usersImage + "default.png"
            : user.avatar.startsWith("http") // handle social login pictures
            ? user.avatar
            : sharedVariable.address +
              sharedVariable.usersImage +
              user.id +
              "/" +
              user.avatar;

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
    const image =
        sharedVariable.address + sharedVariable.countryImage + country.image;
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
        adminId: objUser.adminId,
        message: objMessage,
        title: objTitle,
        key,
        data: data || {}, // store any additional data
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
    i18n.setLocale(lang); // set the appropriate language

    // sanitize and convert all `data` values to strings
    const sanitizedData = {};
    Object.entries(data || {}).forEach(([k, v]) => {
        if (v === null || v === undefined) {
            sanitizedData[k] = "";
        } else if (typeof v === "object") {
            // for objects, stringify them
            sanitizedData[k] = JSON.stringify(v);
        } else {
            // for primitives, convert to string
            sanitizedData[k] = String(v);
        }
    });

    // attach any additional data to the notification
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
        // displayed notification content
        notification: {
            title,
            body,
        },

        // token for the recipient device
        token: deviceToken,

        // custom data for internal processing
        data: {
            key,
            sound: "default",
            badge: String(counter || 1), // firebase requires strings for badge
            ...sanitizedData, // spread the sanitized data directly
        },
    };
};

export const chatMessageObj = (message, lang) => {
    moment.locale(lang); // set the appropriate language

    let content = message.content;

    if (message.messageType === "image") {
        content =
            sharedVariable.address + sharedVariable.chatImage + message.content;
    } else if (message.messageType === "audio") {
        content =
            sharedVariable.address + sharedVariable.chatAudio + message.content;
    }

    return {
        id: message._id,
        chatRoom: message.chatRoom,
        sender: userObj(message.sender),
        content,
        messageType: message.messageType,
        replyTo: message.replyTo
            ? chatMessageWithNoReplyObj(message.replyTo, lang)
            : null,
        createdAt: moment(message.createdAt).format("MMM D, h:mm A"),
        updatedAt: moment(message.updatedAt).format("MMM D, h:mm A"),
    };
};

// chat message object without reply to avoid recursion
export const chatMessageWithNoReplyObj = (message, lang) => {
    moment.locale(lang); // set the appropriate language

    return {
        id: message._id,
        chatRoom: message.chatRoom,
        sender: userObj(message.sender),
        content: message.content,
        messageType: message.messageType,
        replyTo: null,
        createdAt: moment(message.createdAt).format("MMM D, h:mm A"),
        updatedAt: moment(message.updatedAt).format("MMM D, h:mm A"),
    };
};

export const chatRoomObj = (room, lang) => {
    moment.locale(lang); // set the appropriate language

    return {
        id: room._id,
        roomType: room.roomType,
        lastMessage: room.lastMessage
            ? chatMessageObj(room.lastMessage, lang)
            : null,
        lastMessageAt: room.lastMessageAt
            ? moment(room.lastMessageAt).format("MMM D, h:mm A")
            : null,
        unreadCount: room.unreadCount || {},
        status: room.status,
        participants: room.participants.map((p) => userObj(p)) || [],
        createdAt: moment(room.createdAt).format("MMM D, h:mm A"),
        updatedAt: moment(room.updatedAt).format("MMM D, h:mm A"),
    };
};
