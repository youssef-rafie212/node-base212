import i18n from "i18n";

import { apiError, apiResponse, returnObject } from "../../utils/index.js";
import {
    duplicate,
    userAvatars,
    validateRole,
    getModel,
    validateCountryExists,
} from "../../helpers/index.js";

// create new user
export const createUser = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(model, "email", data.email);
            if (isDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("emailExists")));
            }
        }

        // check for duplicate phone if it exists in body
        if (data.phone) {
            const isPhoneDuplicate = await duplicate(
                model,
                "phone",
                data.phone
            );
            if (isPhoneDuplicate) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("phoneExists")));
            }
        }

        // validate country if it exists in body
        if (data.country) {
            const isCountryValid = await validateCountryExists(data.country);
            if (!isCountryValid) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("invalidCountry")));
            }
        }

        // handle avatar upload if it exists in the request
        const id = await userAvatars.uploadAvatar(req, "users", data);

        // create new user
        const user = await model.create({ _id: id, ...data });

        // populate wanted fields
        await user.populate("country");

        // generate response object
        const resData = returnObject.userObj(user);

        res.send(apiResponse(200, i18n.__("documentCreated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // pagination
        let { page = 1, limit = 10 } = req.query;
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

// get user by id
export const getUser = async (req, res) => {
    try {
        const data = req.validatedData;

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
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // generate response object
        const resData = returnObject.userObj(user);

        res.send(apiResponse(200, i18n.__("documentsFetched"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// update user
export const updateUser = async (req, res) => {
    try {
        const data = req.validatedData;

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
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // check for duplicate email if it exists in body
        if (data.email) {
            const isDuplicate = await duplicate(
                model,
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
                model,
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

        // validate country if it exists in body
        if (data.country) {
            const isCountryValid = await validateCountryExists(data.country);
            if (!isCountryValid) {
                return res
                    .status(400)
                    .send(apiError(400, i18n.__("invalidCountry")));
            }
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

        res.send(apiResponse(200, i18n.__("documentUpdated"), resData));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// soft delete user by id
export const deleteUser = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // find user by id and soft delete it
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // soft delete the user
        user.status = "deleted";
        await user.save();

        res.send(apiResponse(200, i18n.__("documentDeleted"), {}));
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};

// toggle block user
export const toggleBlockUser = async (req, res) => {
    try {
        const data = req.validatedData;

        // get model based on type
        const model = getModel(data.type);

        // find user by id
        const user = await model.findOne({
            _id: data.id,
            status: { $ne: "deleted" },
        });

        if (!user) {
            return res
                .status(400)
                .send(apiError(400, i18n.__("documentNotFound")));
        }

        // toggle block user
        user.status = user.status === "active" ? "blocked" : "active";
        await user.save();

        res.send(
            apiResponse(200, i18n.__("documentUpdated"), {
                newStatus: user.status,
            })
        );
    } catch (error) {
        console.log(error);
        res.status(500).send(apiError(500, i18n.__("returnDeveloper")));
    }
};
