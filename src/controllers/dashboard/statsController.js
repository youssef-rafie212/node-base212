import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class StatsController {
    constructor(statsService) {
        this.statsService = statsService;

        // bind all methods
        this.getStats = this.getStats.bind(this);
    }

    async getStats(req, res) {
        try {
            const response = await this.statsService.getStats();

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
}
