// checks if a field value is duplicated in the database
const duplicate = async (models, fieldName, fieldValue, updateId) => {
    // make sure models is an array
    if (!Array.isArray(models)) models = [models];

    for (const model of models) {
        const query = {
            [fieldName]: fieldValue,
            status: { $ne: "deleted" },
        };

        if (updateId) query._id = { $ne: updateId };

        const found = await model.findOne(query).lean().select("_id");
        if (found) return found; // stop at first match
    }
    return null;
};

export default duplicate;
