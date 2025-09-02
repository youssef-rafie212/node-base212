import { generateJwt } from "../../utils/index.js";
import { UserToken } from "../../models/index.js";

// generate and store new jwt token
export const newToken = async (userId, userType) => {
    // generate jwt token
    const token = generateJwt(userId, userType);

    // store the token (if the type is not admin)
    if (userType !== "admin") {
        await UserToken.create({ userId, token });
    }

    return token;
};

// delete all user tokens
export const deleteAllUserTokens = async (userId) => {
    await UserToken.deleteMany({ userId });
};
