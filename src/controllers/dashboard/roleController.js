import i18n from "i18n";

import {
    apiError,
    apiResponse,
    returnObject,
    sharedVariable,
} from "../../utils/index.js";
import { Role, Admin } from "../../models/index.js";
import { duplicateArEnName } from "../../helpers/index.js";

// create new role
export const createRole = async (req, res) => {
    try {
        const data = req.validatedData;

        // check for duplicate role name (both en and ar)
        const nameExists = await duplicateArEnName(Role, data.name);
        if (nameExists) {
            return res.status(400).send(apiError(400, i18n.__("nameExists")));
        }

        // create new role
        const role = await Role.create(data);

        // generate response object
        const resData = returnObject.roleObj(role);

        res.send(apiResponse(200, i18n.__("documentCreated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// gets all roles
export const getAllRoles = async (req, res) => {
    try {
        // pagination
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // get roles and total count
        const query = { status: "active" };
        const [totalCount, roles] = await Promise.all([
            Role.countDocuments(query),
            Role.find(query).skip(skip).limit(limit),
        ]);

        // calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // format role objects
        const resData = roles.map((role) => returnObject.roleObj(role));

        res.send(
            apiResponse(
                200,
                i18n.__("documentsFetched"),
                resData,
                totalCount,
                page,
                totalPages
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// get role by id
export const getRole = async (req, res) => {
    try {
        const data = req.validatedData;

        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // generate response object
        const resData = returnObject.roleObj(role);

        res.send(apiResponse(200, i18n.__("documentsFetched"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// updates role name
export const updateRoleName = async (req, res) => {
    try {
        const data = req.validatedData;

        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // dont allow updating admin role
        if (role.isSuperAdminRole) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("cantModifyAdminRole")));
        }

        // check for duplicate role name (both en and ar)
        const nameExists = await duplicateArEnName(Role, data.name, data.id);
        if (nameExists) {
            return res.status(400).send(apiError(400, i18n.__("nameExists")));
        }

        // update role name
        role.name = data.name;
        await role.save();

        // generate response object
        const resData = returnObject.roleObj(role);

        res.send(apiResponse(200, i18n.__("documentUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// delete role by id
export const deleteRole = async (req, res) => {
    try {
        const data = req.validatedData;

        // find role by id and soft delete it
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // dont allow deleting admin role
        if (role.isSuperAdminRole) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("cantModifyAdminRole")));
        }

        // soft delete role
        role.status = "deleted";
        await role.save();

        // soft delete all admins with that role
        await Admin.updateMany({ role: role._id }, { status: "deleted" });

        res.send(apiResponse(200, i18n.__("documentDeleted"), {}));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// get all permessions
export const getAllPermissions = async (req, res) => {
    try {
        res.send(
            apiResponse(
                200,
                i18n.__("documentsFetched"),
                sharedVariable.allPermissions
            )
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// add permissions to role
export const addPermissionsToRole = async (req, res) => {
    try {
        const data = req.validatedData;

        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        const newPermissions = data.permissions;
        const currentPermissions = role.permissions;

        // remove duplicates
        const uniqueNewPermissions = newPermissions.filter(
            (perm) => !currentPermissions.includes(perm)
        );

        // add new permissions
        role.permissions.push(...uniqueNewPermissions);

        // save
        await role.save();

        // generate response object
        const resData = returnObject.roleObj(role);

        res.send(apiResponse(200, i18n.__("documentUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// remove permissions from role
export const removePermissionsFromRole = async (req, res) => {
    try {
        const data = req.validatedData;

        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // remove permissions
        role.permissions = role.permissions.filter(
            (perm) => !data.permissions.includes(perm)
        );

        // save
        await role.save();

        // generate response object
        const resData = returnObject.roleObj(role);

        res.send(apiResponse(200, i18n.__("documentUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
