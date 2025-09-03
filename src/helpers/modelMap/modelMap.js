import { User, Admin } from "../../models/index.js";

// map user types to models
const getModel = (userType) => {
    if (!userType) return null;

    const modelMap = {
        user: User,
        admin: Admin,
    };

    const model = modelMap[userType.toLowerCase()];

    return model;
};

export default getModel;
