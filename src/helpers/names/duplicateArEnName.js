// checks if name is duplicate (either the arabic or english one)
export const duplicateArEnName = async (model, name, updateId) => {
    const duplicate = updateId
        ? await model.findOne({
              _id: { $ne: updateId },
              $or: [{ "name.ar": name.ar }, { "name.en": name.en }],
          })
        : await model.findOne({
              $or: [{ "name.ar": name.ar }, { "name.en": name.en }],
          });

    return duplicate;
};
