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
        isVerified: user.isVerified,
        country: user.country ? countryObj(user.country) : null,
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

export const sendNotifyObj = (
    deviceToken,
    objTitle,
    objMessage,
    key,
    data,
    lang = "ar",
    counter
) => {
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

    const title = objTitle[lang];

    const body = objMessage[lang];

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
            badge: String(counter || 1), // ensure badge is a string
            ...sanitizedData, // spread the sanitized data directly
        },
    };
};

export const messageUserObj = (user) => {
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
        name: user.name,
        avatar,
    };
};

export const chatMessageObj = (message, lang) => {
    moment.locale(lang); // set the appropriate language

    return {
        id: message._id,
        chatRoomId: message.chatRoom,
        sender: messageUserObj(message.sender),
        content: message.content,
        messageType: message.messageType,
        createdAt: moment(message.createdAt).format("h:mm A"),
        updatedAt: moment(message.updatedAt).format("h:mm A"),
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
            ? moment(room.lastMessageAt).format("h:mm A")
            : null,
        unreadCount: room.unreadCount || {},
        status: room.status,
        participants: room.participants.map((p) => userObj(p.user)) || [],
        createdAt: moment(room.createdAt).format("h:mm A"),
        updatedAt: moment(room.updatedAt).format("h:mm A"),
    };
};

export const adminObj = (admin, role) => {
    const avatar =
        !admin.avatar || admin.avatar === "" || admin.avatar === "default.png"
            ? sharedVariable.address +
              sharedVariable.supervisorsImage +
              "default.png"
            : sharedVariable.address +
              sharedVariable.supervisorsImage +
              admin.id +
              "/" +
              admin.avatar;

    return {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        avatar,
        status: admin.status,
        language: admin.language,
        isSuperAdmin: admin.isSuperAdmin,
        role: role.name,
    };
};

export const adminWithTokenObj = (admin, role, token) => {
    return {
        token,
        admin: adminObj(admin, role),
    };
};

export const roleObj = (role) => {
    return {
        id: role._id,
        name: role.name,
        status: role.status,
        permissions: role.permissions,
    };
};

export const statObj = (title, count) => {
    return {
        title,
        count,
    };
};

export const settingsObj = (settings) => {
    return {
        linkAndroid: settings.linkAndroid,
        linkApple: settings.linkApple,
        phone: settings.phone,
        email: settings.email,
        appTitle: settings.appTitle,
        codeGenerate: settings.codeGenerate,
        code: settings.code,
        dashboardSecretToken: settings.dashboardSecretToken,
        version: settings.version,
    };
};
