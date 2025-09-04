import i18n from "i18n";

import { apiError, apiResponse, returnObject } from "../../utils/index.js";
import { duplicate, userAvatars, validateRole } from "../../helpers/index.js";
import { Admin } from "../../models/index.js";

// create new admin
export const createAdmin = async (req, res) => {
    try {
        const data = req.validatedData;

        // check if role exists and not the super admin
        const validRole = await validateRole(data.role, false);

        if (!validRole) {
            return res.status(400).send(apiError(400, i18n.__("invalidRole")));
        }

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(Admin, "email", data.email);
            if (isDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
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
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("phoneExists")));
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

        res.send(apiResponse(200, i18n.__("documentCreated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// get all admins
export const getAllAdmins = async (req, res) => {
    try {
        // pagination
        let { page = 1, limit = 10 } = req.query;
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

// get admin by id
export const getAdmin = async (req, res) => {
    try {
        const data = req.validatedData;

        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        }).populate("role");

        if (!admin) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // generate response object
        const resData = returnObject.adminObj(admin, admin.role);

        res.send(apiResponse(200, i18n.__("documentsFetched"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// update admin
export const updateAdmin = async (req, res) => {
    try {
        const data = req.validatedData;

        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        }).populate("role");

        if (!admin) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // check if role exists and not the super admin
        if (data.role) {
            const validRole = await validateRole(data.role, false);

            if (!validRole) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("invalidRole")));
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
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
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
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("phoneExists")));
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

        res.send(apiResponse(200, i18n.__("documentUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// soft delete admin by id
export const deleteAdmin = async (req, res) => {
    try {
        const data = req.validatedData;

        // find admin by id and soft delete it
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!admin) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // soft delete the admin
        admin.status = "deleted";
        await admin.save();

        res.send(apiResponse(200, i18n.__("documentDeleted"), {}));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// toggle block admin
export const toggleBlockAdmin = async (req, res) => {
    try {
        const data = req.validatedData;

        // find admin by id
        const admin = await Admin.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!admin) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // toggle block admin
        admin.status = admin.status === "active" ? "blocked" : "active";
        await admin.save();

        res.send(
            apiResponse(200, i18n.__("documentUpdated"), {
                newStatus: admin.status,
            })
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
