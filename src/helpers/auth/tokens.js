import { generateJwt } from "../../utils/index.js";
import { UserToken } from "../../models/index.js";
import getRef from "../refMap/refMap.js";

// generate and store new jwt token
export const newToken = async (userId, userType) => {
    // generate jwt token
    const token = generateJwt(userId, userType);

    // store the token (if the type is not admin)
    if (userType !== "admin") {
        await UserToken.create({
            user: userId,
            userRef: getRef(userType),
            token,
        });
    }

    return token;
};

// delete all user tokens
export const deleteAllUserTokens = async (userId) => {
    await UserToken.deleteMany({ user: userId });
};

// delete all user tokens exept the current one
export const deleteAllUserTokensExceptCurrent = async (
    userId,
    currentToken
) => {
    await UserToken.deleteMany({ user: userId, token: { $ne: currentToken } });
};
