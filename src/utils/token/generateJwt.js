import jwt from "jsonwebtoken";

const generateJwt = (id, userType = "user") => {
    const token = jwt.sign(
        {
            id,
            userType: userType,
        },
        process.env.JWT_SECRET || "default_secret"
    );

    return token;
};

export default generateJwt;
