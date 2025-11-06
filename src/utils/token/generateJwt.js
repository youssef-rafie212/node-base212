import jwt from "jsonwebtoken";
import { JwtConfig } from "../../../config/index.js";

// generate a jwt
const generateJwt = (id, userType = "user") => {
    const token = jwt.sign(
        {
            id,
            userType: userType,
        },
        JwtConfig.secret
    );

    return token;
};

export default generateJwt;
