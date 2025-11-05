import { returnObject } from "../../utils/index.js";

import {
    Admin,
    User,
    ChatRoom,
    ChatMessage,
    Country,
    Role,
    Device,
} from "../../models/index.js";

export class StatsService {
    async getStats() {
        const [
            adminCount,
            userCount,
            chatRoomCount,
            chatMessageCount,
            countryCount,
            roleCount,
            deviceCount,
        ] = await Promise.all([
            Admin.countDocuments({ status: { $ne: "deleted" } }),
            User.countDocuments({ status: { $ne: "deleted" } }),
            ChatRoom.countDocuments({ status: { $ne: "deleted" } }),
            ChatMessage.countDocuments({ status: { $ne: "deleted" } }),
            Country.countDocuments(),
            Role.countDocuments({ status: { $ne: "deleted" } }),
            Device.countDocuments(),
        ]);

        // format stat objects
        const resData = [
            returnObject.statObj(
                { ar: "عدد المشرفين", en: "Admin Count" },
                adminCount
            ),
            returnObject.statObj(
                { ar: "عدد المستخدمين", en: "User Count" },
                userCount
            ),
            returnObject.statObj(
                { ar: "عدد الدردشات", en: "Chat Room Count" },
                chatRoomCount
            ),
            returnObject.statObj(
                { ar: "عدد الرسائل", en: "Chat Message Count" },
                chatMessageCount
            ),
            returnObject.statObj(
                { ar: "عدد الدول", en: "Country Count" },
                countryCount
            ),
            returnObject.statObj(
                { ar: "عدد الأدوار", en: "Role Count" },
                roleCount
            ),
            returnObject.statObj(
                { ar: "عدد الأجهزة", en: "Device Count" },
                deviceCount
            ),
        ];

        return {
            error: null,
            data: resData,
        };
    }
}
