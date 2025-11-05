import i18n from "i18n";

import { returnObject } from "../../utils/index.js";
import { duplicate, userAvatars, validateRole } from "../../helpers/index.js";
import { Admin } from "../../models/index.js";

export class AdminService {
    async createAdmin(data, req) {
        // check if role exists and not the super admin
        const validRole = await validateRole(data.role, false);

        if (!validRole) {
            return {
                error: i18n.__("invalidRole"),
                data: null,
            };
        }

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(Admin, "email", data.email);
            if (isDuplicate) {
                return {
                    error: i18n.__("emailExists"),
                    data: null,
                };
            }
        }

        // check for duplicate phone if it exists in body
        if (data.phone) {
            const isPhoneDuplicate = await duplicate(
                Admin,
                "phone",
                data.phone
            );
            if (isPhoneDuplicate) {
                return {
                    error: i18n.__("phoneExists"),
                    data: null,
                };
            }
        }

        // handle avatar upload if it exists in the request
        const id = await userAvatars.uploadAvatar(req, "supervisors", data);

        // create new admin
        const admin = await Admin.create({ _id: id, ...data });

        // populate wanted fields
        await admin.populate("role");

        // generate response object
        const resData = returnObject.adminObj(admin, admin.role);

        return {
            error: null,
            data: resData,
        };
    }

    async getAllAdmins(page = 1, limit = 10) {
        // pagination
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // get admins and total count
        const query = { status: { $ne: "deleted" } };
        const [totalCount, admins] = await Promise.all([
            Admin.countDocuments(query),
            Admin.find(query).populate("role").skip(skip).limit(limit),
        ]);

        // calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // format admin objects
        const resData = admins.map((admin) =>
            returnObject.adminObj(admin, admin.role)
        );

        return {
            error: null,
            data: resData,
            totalCount,
            page,
            totalPages,
        };
    }

    async getAdmin(data) {
        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        }).populate("role");

        if (!admin) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // generate response object
        const resData = returnObject.adminObj(admin, admin.role);

        return {
            error: null,
            data: resData,
        };
    }

    async updateAdmin(data, req) {
        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        }).populate("role");

        if (!admin) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // check if role exists and not the super admin
        if (data.role) {
            const validRole = await validateRole(data.role, false);

            if (!validRole) {
                return {
                    error: i18n.__("invalidRole"),
                    data: null,
                };
            }
        }

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(
                Admin,
                "email",
                data.email,
                data.id
            );
            if (isDuplicate) {
                return {
                    error: i18n.__("emailExists"),
                    data: null,
                };
            }
        }

        // check for duplicate phone if it exists in body
        if (data.phone) {
            const isPhoneDuplicate = await duplicate(
                Admin,
                "phone",
                data.phone,
                data.id
            );
            if (isPhoneDuplicate) {
                return {
                    error: i18n.__("phoneExists"),
                    data: null,
                };
            }
        }

        // handle avatar upload if it exists in the request
        await userAvatars.uploadAvatar(
            req,
            "supervisors",
            data,
            true,
            data.id,
            admin.avatar
        );

        // update admin
        Object.assign(admin, data);
        await admin.save();

        // generate response object
        const resData = returnObject.adminObj(admin, admin.role);

        return {
            error: null,
            data: resData,
        };
    }

    async deleteAdmin(data) {
        // find admin by id and soft delete it
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!admin) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // soft delete the admin
        admin.status = "deleted";
        await admin.save();

        return {
            error: null,
            data: {},
        };
    }

    async toggleBlockAdmin(data) {
        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!admin) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // toggle block admin
        admin.status = admin.status === "active" ? "blocked" : "active";
        await admin.save();

        return {
            error: null,
            data: {
                newStatus: admin.status,
            },
        };
    }
}
