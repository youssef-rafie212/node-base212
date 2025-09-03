// map user types to mongo references
const getRef = (userType) => {
    if (!userType) return null;

    const modelMap = {
        user: "User",
        admin: "Admin",
    };

    const model = modelMap[userType.toLowerCase()];

    return model;
};

export default getRef;
