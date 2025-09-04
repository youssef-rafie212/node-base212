import i18n from "i18n";

import { apiResponse, apiError, returnObject } from "../../utils/index.js";
import { Settings } from "../../models/index.js";

// gets the app settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        res.send(
            apiResponse(
                200,
                i18n.__("documentsFetched"),
                returnObject.settingsObj(settings)
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// update the current app settings
export const updateSettings = async (req, res) => {
    try {
        const data = req.validatedData;

        const settings = await Settings.findOne();

        if (!settings) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        Object.assign(settings, data);
        await settings.save();

        res.send(
            apiResponse(
                200,
                i18n.__("documentUpdated"),
                returnObject.settingsObj(settings)
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
