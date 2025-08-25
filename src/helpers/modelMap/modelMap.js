import { User, Admin } from "../../models/index.js";

// map user types to models
const getModel = (userType) => {
    const modelMap = {
        user: User,
        guest: User,
        admin: Admin,
    };

    const model = modelMap[userType.toLowerCase()];

    return model;
};

export default getModel;
