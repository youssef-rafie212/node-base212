// map user types to mongo references
const getRef = (userType) => {
    if (!userType) return null;

    const refMap = {
        user: "User",
        admin: "Admin",
    };

    const ref = refMap[userType.toLowerCase()];

    return ref;
};

export default getRef;
