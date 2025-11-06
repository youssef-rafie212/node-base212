// finds user by email or phone
export const getUserWithIdentifier = async (
    model,
    identifier,
    extraFilters = {}
) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    let fieldName = null;

    if (emailRegex.test(identifier)) fieldName = "email";
    else if (phoneRegex.test(identifier)) fieldName = "phone";
    else return null;

    const user = await model.findOne({
        [fieldName]: identifier,
        status: "active",
        ...extraFilters,
    });

    return user ? user : null;
};
