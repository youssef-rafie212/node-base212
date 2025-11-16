import { getTypeWithIdentifier } from "../index.js";

// finds user by email or phone
export const getUserWithIdentifier = async (
    model,
    identifier,
    extraFilters = {}
) => {
    const fieldName = getTypeWithIdentifier(identifier);

    const user = await model.findOne({
        [fieldName]: identifier,
        status: "active",
        ...extraFilters,
    });

    return user ? user : null;
};
