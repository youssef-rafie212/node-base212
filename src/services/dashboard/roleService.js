import i18n from "i18n";

import { returnObject, sharedVariable } from "../../utils/index.js";
import { Role, Admin } from "../../models/index.js";
import { duplicateArEnName } from "../../helpers/index.js";

export class RoleService {
    async createRole(data) {
        // check for duplicate role name (both en and ar)
        const nameExists = await duplicateArEnName(Role, data.name);
        if (nameExists) {
            return {
                error: i18n.__("nameExists"),
                data: null,
            };
        }

        // create new role
        const role = await Role.create(data);

        // generate response object
        const resData = returnObject.roleObj(role);

        return {
            error: null,
            data: resData,
        };
    }

    async getAllRoles(page = 1, limit = 10) {
        // pagination
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

        return {
            error: null,
            data: resData,
            totalCount,
            page,
            totalPages,
        };
    }

    async getRole(data) {
        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // generate response object
        const resData = returnObject.roleObj(role);

        return {
            error: null,
            data: resData,
        };
    }

    async updateRoleName(data) {
        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // dont allow updating admin role
        if (role.isSuperAdminRole) {
            return {
                error: i18n.__("cantModifyAdminRole"),
                data: null,
            };
        }

        // check for duplicate role name (both en and ar)
        const nameExists = await duplicateArEnName(Role, data.name, data.id);
        if (nameExists) {
            return {
                error: i18n.__("nameExists"),
                data: null,
            };
        }

        // update role name
        role.name = data.name;
        await role.save();

        // generate response object
        const resData = returnObject.roleObj(role);

        return {
            error: null,
            data: resData,
        };
    }

    async deleteRole(data) {
        // find role by id and soft delete it
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // dont allow deleting admin role
        if (role.isSuperAdminRole) {
            return {
                error: i18n.__("cantModifyAdminRole"),
                data: null,
            };
        }

        // soft delete role
        role.status = "deleted";
        await role.save();

        // soft delete all admins with that role
        await Admin.updateMany({ role: role._id }, { status: "deleted" });

        return {
            error: null,
            data: {},
        };
    }

    getAllPermissions() {
        return {
            error: null,
            data: sharedVariable.allPermissions,
        };
    }

    async addPermissionsToRole(data) {
        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
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

        return {
            error: null,
            data: resData,
        };
    }

    async removePermissionsFromRole(data) {
        // find role by id
        const role = await Role.findOne({ _id: data.id, status: "active" });
        if (!role) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // remove permissions
        role.permissions = role.permissions.filter(
            (perm) => !data.permissions.includes(perm)
        );

        // save
        await role.save();

        // generate response object
        const resData = returnObject.roleObj(role);

        return {
            error: null,
            data: resData,
        };
    }
}
