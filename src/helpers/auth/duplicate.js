import { User } from "../../models/index.js";

// checks if a field value is duplicated in the database
const duplicate = async (fieldName, fieldValue, updateId) => {
    let user = null;
    // if the action is update then we exclude the current document from the check
    if (updateId) {
        user = await User.findOne({
            [fieldName]: fieldValue,
            status: { $ne: "deleted" },
            _id: { $ne: updateId },
        });
        // the action is create
    } else {
        user = await User.findOne({
            [fieldName]: fieldValue,
            status: { $ne: "deleted" },
        });
    }
    return user;
};

export default duplicate;
