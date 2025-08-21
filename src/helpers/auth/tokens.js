import generateJwt from "../../utils/token/generateJwt.js";
import UserToken from "../../models/userToken.js";

export const newToken = async (userId, userType) => {
    const token = generateJwt(userId, userType);
    await UserToken.create({ userId, token, userRef: userType });
    return token;
};

export const deleteAllUserTokens = async (userId) => {
    await UserToken.deleteMany({ userId });
};
