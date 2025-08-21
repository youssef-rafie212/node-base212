import User from "../../models/userModel.js";
import Admin from "../../models/adminModel.js";

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
