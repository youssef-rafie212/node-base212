import i18n from "i18n";

import { apiResponse, apiError } from "../../utils/index.js";

export class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }

    async sendSingleNotification(req, res) {
        try {
            const data = req.validatedData;

            const response =
                await this.notificationService.sendSingleNotification(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("notificationSent"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async sendAllNotification(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.notificationService.sendAllNotification(
                data
            );

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("notificationSent"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
