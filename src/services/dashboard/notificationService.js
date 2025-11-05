import i18n from "i18n";

import { getModel } from "../../helpers/index.js";
import { handleNotification } from "../../external-services/index.js";

export class NotificationService {
    async sendSingleNotification(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // prepare notification data
        const titleObj = { ar: data.title.ar, en: data.title.en };
        const messageObj = { ar: data.message.ar, en: data.message.en };

        // send notification
        await handleNotification(
            user,
            titleObj,
            messageObj,
            "admin",
            {},
            user.notifyCount + 1
        );

        return {
            error: null,
            data: {},
        };
    }

    async sendAllNotification(data) {
        // get model based on type
        const model = getModel(data.type);

        const users = await model.find({
            status: { $ne: "deleted" },
        });

        await Promise.all(
            users.map((user) => {
                // prepare notification data
                const titleObj = { ar: data.title.ar, en: data.title.en };
                const messageObj = { ar: data.message.ar, en: data.message.en };

                // send notification
                return handleNotification(
                    user,
                    titleObj,
                    messageObj,
                    "admin",
                    {},
                    user.notifyCount + 1
                );
            })
        );
    }
}
