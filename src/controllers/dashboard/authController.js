import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class AuthController {
    constructor(authService) {
        this.authService = authService;

        // bind all methods
        this.getCsrf = this.getCsrf.bind(this);
        this.adminSignIn = this.adminSignIn.bind(this);
    }

    getCsrf(req, res) {
        const response = this.authService.getCsrf(req, res);

        res.send(apiResponse(200, i18n.__("tokenGenerated"), response.data));
    }

    async adminSignIn(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.authService.adminSignIn(data);

            if (response.error) {
                return res.status(401).send(apiError(401, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("successfulLogin"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
