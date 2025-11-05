import i18n from "i18n";

import { apiResponse, apiError } from "../../utils/index.js";

export class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }

    async getSettings(req, res) {
        try {
            const response = await this.settingsService.getSettings();

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("documentsFetched"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async updateSettings(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.settingsService.updateSettings(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("documentUpdated"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
