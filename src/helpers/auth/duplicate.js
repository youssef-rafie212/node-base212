const duplicate = async (model, fieldName, fieldBValue, updateId) => {
    let user = null;
    if (updateId) {
        user = await model.findOne({
            [fieldName]: fieldBValue,
            status: { $ne: "delete" },
            _id: { $ne: updateId },
        });
    } else {
        user = await model.findOne({ [fieldName]: fieldBValue, status: { $ne: "delete" } });
    }
    return user;
};

export default duplicate;
