import { validationResult } from "express-validator";
import apiError from "../../helpers/api/apiError.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.send(apiError(400, firstError.msg));
    }
    next();
};

export default validateRequest;
