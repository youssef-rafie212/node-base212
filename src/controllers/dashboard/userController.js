import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class UserController {
    constructor(userService) {
        this.userService = userService;

        // bind all methods
        this.createUser = this.createUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUser = this.getUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.toggleBlockUser = this.toggleBlockUser.bind(this);
    }

    async createUser(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.createUser(data, req);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("documentCreated"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async getAllUsers(req, res) {
        try {
            const data = req.validatedData;

            // pagination data
            const { page = 1, limit = 10 } = req.query;

            const response = await this.userService.getAllUsers(
                data,
                page,
                limit
            );

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(
                    200,
                    i18n.__("documentsFetched"),
                    response.data,
                    response.totalCount,
                    response.page,
                    response.totalPages
                )
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async getUser(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.getUser(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(apiResponse(200, i18n.__("documentsFetched"), response));
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async updateUser(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.updateUser(data, req);

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

    async deleteUser(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.deleteUser(data);

            if (response.error) {
                return res.status(400).send(apiError(400, response.error));
            }

            res.send(
                apiResponse(200, i18n.__("documentDeleted"), response.data)
            );
        } catch (error) {
            console.log(error);
            res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
        }
    }

    async toggleBlockUser(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.userService.toggleBlockUser(data);

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
