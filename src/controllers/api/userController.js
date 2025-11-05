import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async me(req, res) {
        try {
            const response = await this.userService.me(req.sub);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userFetched"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async updatePassword(req, res) {
        try {
            const data = req.validatedData;

            const currentToken = req.headers.authorization.split(" ")[1];

            const response = await this.userService.updatePassword(
                data,
                req.sub,
                currentToken
            );

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("passwordUpdated"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async updateMe(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.updateMe(
                data,
                req.sub,
                req
            );

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userUpdated"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async deleteMe(req, res) {
        try {
            const response = await this.userService.deleteMe(req.sub);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("userDeleted"), response.data));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }
}
