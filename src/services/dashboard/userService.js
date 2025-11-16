import i18n from "i18n";

import { returnObject } from "../../utils/index.js";
import { userAvatars, getModel } from "../../helpers/index.js";

export class UserService {
    async createUser(data, req) {
        // get model based on type
        const model = getModel(data.type);

        // handle avatar upload if it exists in the request
        const id = await userAvatars.uploadAvatar(req, "users", data);

        // create new user
        const user = await model.create({ _id: id, ...data });

        // populate wanted fields
        await user.populate("country");

        // generate response object
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async getAllUsers(data, page = 1, limit = 10) {
        // get model based on type
        const model = getModel(data.type);

        // pagination
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // get users and total count
        const query = { status: { $ne: "deleted" } };
        const [totalCount, users] = await Promise.all([
            model.countDocuments(query),
            model.find(query).populate("country").skip(skip).limit(limit),
        ]);

        // calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // format admin objects
        const resData = users.map((user) => returnObject.userObj(user));

        return {
            error: null,
            data: resData,
            totalCount,
            page,
            totalPages,
        };
    }

    async getUser(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model
            .findOne({
                _id: data.id,
                status: { $ne: "deleted" },
            })
            .populate("country");

        if (!user) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // generate response object
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async updateUser(data, req) {
        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model
            .findOne({
                _id: data.id,
                status: { $ne: "deleted" },
            })
            .populate("country");

        if (!user) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // handle avatar upload if it exists in the request
        await userAvatars.uploadAvatar(
            req,
            "users",
            data,
            true,
            data.id,
            user.avatar
        );

        // update user
        Object.assign(user, data);
        await user.save();

        // generate response object
        const resData = returnObject.userObj(user);

        return {
            error: null,
            data: resData,
        };
    }

    async deleteUser(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by id and soft delete it
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // soft delete the user
        user.status = "deleted";
        await user.save();

        return {
            error: null,
            data: {},
        };
    }

    async toggleBlockUser(data) {
        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return {
                error: i18n.__("documentNotFound"),
                data: null,
            };
        }

        // toggle block user
        user.status = user.status === "active" ? "blocked" : "active";
        await user.save();

        return {
            error: null,
            data: {
                newStatus: user.status,
            },
        };
    }
}
