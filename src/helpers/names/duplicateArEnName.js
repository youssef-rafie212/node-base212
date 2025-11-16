// checks if name is duplicate (either the arabic or english one)
export const duplicateArEnName = async (model, name, updateId) => {
    const duplicate = updateId
        ? await model.findOne({
              _id: { $ne: updateId },
              status: { $ne: "deleted" },
              $or: [{ "name.ar": name.ar }, { "name.en": name.en }],
          })
        : await model.findOne({
              status: { $ne: "deleted" },
              $or: [{ "name.ar": name.ar }, { "name.en": name.en }],
          });

    return duplicate ? true : false;
};
