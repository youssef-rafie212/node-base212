// checks if a field value is duplicated in the database
const duplicate = async (model, fieldName, fieldValue, updateId) => {
    let user = null;
    // if the action is update then we exclude the current document from the check
    if (updateId) {
        user = await model.findOne({
            [fieldName]: fieldValue,
            status: { $ne: "deleted" },
            _id: { $ne: updateId },
        });
        // the action is create
    } else {
        user = await model.findOne({
            [fieldName]: fieldValue,
            status: { $ne: "deleted" },
        });
    }
    return user;
};

export default duplicate;
