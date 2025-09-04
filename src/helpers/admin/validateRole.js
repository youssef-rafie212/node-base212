import { Role } from "../../models/index.js";

// checks if the role exists and not/is the super admin role
export const validateRole = async (id, isAdmin) => {
    const role = await Role.findOne({
        _id: id,
        status: "active",
        isAdmin,
    });

    return role ? true : false;
};
