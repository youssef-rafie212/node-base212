import i18n from "i18n";

import { returnObject } from "../../utils/index.js";
import { Settings } from "../../models/index.js";

export class SettingsService {
    async getSettings() {
        const settings = await Settings.findOne();

        if (!settings) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        return {
            error: null,
            data: returnObject.settingsObj(settings),
        };
    }

    async updateSettings(data) {
        const settings = await Settings.findOne();

        if (!settings) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        Object.assign(settings, data);
        await settings.save();

        return {
            error: null,
            data: returnObject.settingsObj(settings),
        };
    }
}
