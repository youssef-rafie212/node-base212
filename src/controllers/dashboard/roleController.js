import i18n from "i18n";

import {
    apiError,
    apiResponse,
    returnObject,
    sharedVariable,
} from "../../utils/index.js";
import { Role, Admin } from "../../models/index.js";
import { duplicateArEnName } from "../../helpers/index.js";

export class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }

    async createRole(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.createRole(data);

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

    async getAllRoles(req, res) {
        try {
            // pagination data
            const { page = 1, limit = 10 } = req.query;

            const response = await this.roleService.getAllRoles(page, limit);

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

    async getRole(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.getRole(data);

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

    async updateRoleName(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.updateRoleName(data);

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

    async deleteRole(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.deleteRole(data);

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

    async getAllPermissions(req, res) {
        try {
            const response = this.roleService.getAllPermissions();

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

    async addPermissionsToRole(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.addPermissionsToRole(data);

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

    async removePermissionsFromRole(req, res) {
        try {
            const data = req.validatedData;

            const response = await this.roleService.removePermissionsFromRole(
                data
            );

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
