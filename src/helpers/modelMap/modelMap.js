import User from "../../models/userModel.js";
import Admin from "../../models/adminModel.js";

const getModel = (userType) => {
    const modelMap = {
        user: User,
        guest: User,
        admin: Admin,
    };

    const model = modelMap[userType.toLowerCase()];

    const validKeys = ["user", "admin", "guest"];

    const invalidKeys = Object.keys(modelMap).filter(
        (key) => !validKeys.includes(key)
    );

    if (invalidKeys.length > 0) {
        return null;
    }

    return model;
};

export default getModel;
