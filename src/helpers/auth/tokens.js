import generateJwt from "../../utils/token/generateJwt.js";
import UserToken from "../../models/userToken.js";

// generate and store new jwt token
export const newToken = async (userId, userType) => {
    // generate jwt token
    const token = generateJwt(userId, userType);

    // store the token
    await UserToken.create({ userId, token, userRef: userType });

    return token;
};

// delete all user tokens
export const deleteAllUserTokens = async (userId) => {
    await UserToken.deleteMany({ userId });
};
