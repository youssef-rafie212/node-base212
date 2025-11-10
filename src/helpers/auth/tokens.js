import { generateJwt } from "../../utils/index.js";
import { UserToken } from "../../models/index.js";
import getRef from "../refMap/refMap.js";

// generate and store new jwt token
export const newToken = async (payload) => {
    // generate jwt token
    const token = generateJwt(payload);

    // store the token (if the type is not admin)
    if (payload.userType !== "admin") {
        await UserToken.create({
            user: payload.id,
            userRef: getRef(payload.userType),
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
