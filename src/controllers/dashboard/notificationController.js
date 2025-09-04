import i18n from "i18n";

import { apiResponse, apiError, returnObject } from "../../utils/index.js";
import { getModel, getRef } from "../../helpers/index.js";
import { handleNotification } from "../../services/index.js";

// sends a notification for one user
export const sendSingleNotification = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // prepare notification data
        const userObj = {
            userId: user._id,
            userRef: getRef(data.type),
            notifyId: req.admin.id,
            notifyRef: "Admin",
        };

        const titleObj = { ar: data.title.ar, en: data.title.en };
        const messageObj = { ar: data.message.ar, en: data.message.en };

        // send notification
        await handleNotification(
            userObj,
            messageObj,
            titleObj,
            "admin",
            user.notifyCount + 1,
            user.language || "ar",
            data.data
        );

        res.send(apiResponse(200, i18n.__("notificationSent"), {}));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// sends a notification for all users
export const sendAllNotification = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        const users = await model.find({
            status: { $ne: "deleted" },
        });

        users.forEach(async (user) => {
            // prepare notification data
            const userObj = {
                userId: user._id,
                userRef: getRef(data.type),
                notifyId: req.admin.id,
                notifyRef: "Admin",
            };

            const titleObj = { ar: data.title.ar, en: data.title.en };
            const messageObj = { ar: data.message.ar, en: data.message.en };

            // send notification
            await handleNotification(
                userObj,
                messageObj,
                titleObj,
                "admin",
                user.notifyCount + 1,
                user.language || "ar",
                data.data
            );
        });

        res.send(apiResponse(200, i18n.__("notificationSent"), {}));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
