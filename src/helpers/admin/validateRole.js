import { Role } from "../../models/index.js";

// checks if the role exists and not/is the super admin role
export const validateRole = async (id, isSuperAdminRole) => {
    const role = await Role.findOne({
        _id: id,
        status: "active",
        isSuperAdminRole,
    });

    return role;
};
