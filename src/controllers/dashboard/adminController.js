import i18n from "i18n";

import { apiError, apiResponse } from "../../utils/index.js";

export class AdminController {
    constructor(adminService) {
        this.adminService = adminService;

        // bind all methods
        this.createAdmin = this.createAdmin.bind(this);
        this.getAllAdmins = this.getAllAdmins.bind(this);
        this.getAdmin = this.getAdmin.bind(this);
        this.updateAdmin = this.updateAdmin.bind(this);
        this.deleteAdmin = this.deleteAdmin.bind(this);
        this.toggleBlockAdmin = this.toggleBlockAdmin.bind(this);
    }

    async createAdmin(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.adminService.createAdmin(data, req);

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

    async getAllAdmins(req, res) {
        try {
            // pagination data
            const { page = 1, limit = 10 } = req.query;

            const response = await this.adminService.getAllAdmins(page, limit);

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

    async getAdmin(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.adminService.getAdmin(data);

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

    async updateAdmin(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.adminService.updateAdmin(data, req);

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

    async deleteAdmin(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.adminService.deleteAdmin(data, req);

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

    async toggleBlockAdmin(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.adminService.toggleBlockAdmin(data, req);

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
