import jwt from "jsonwebtoken";
import { JwtConfig } from "../../../config/index.js";

// generate a jwt
const generateJwt = (payload) => {
    const token = jwt.sign(payload, JwtConfig.secret);

    return token;
};

export default generateJwt;
