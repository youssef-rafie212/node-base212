// checks if a field value is duplicated in the database
const duplicate = async (model, fieldName, fieldBValue, updateId) => {
    let user = null;
    // if the action is update then we exclude the current document from the check
    if (updateId) {
        user = await model.findOne({
            [fieldName]: fieldBValue,
            status: { $ne: "delete" },
            _id: { $ne: updateId },
        });
        // the action is create
    } else {
        user = await model.findOne({
            [fieldName]: fieldBValue,
            status: { $ne: "delete" },
        });
    }
    return user;
};

export default duplicate;
