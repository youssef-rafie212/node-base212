import { validationResult } from "express-validator";
import apiError from "../../utils/api/apiError.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).send(apiError(400, firstError.msg));
    }
    next();
};

export default validateRequest;
