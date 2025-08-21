import { validationResult } from "express-validator";

import apiError from "../../utils/api/apiError.js";

// middleware that checks for validation errors
const validateRequest = (req, res, next) => {
    // check for validation errors
    const errors = validationResult(req);

    // if there are errors, return the first one
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).send(apiError(400, firstError.msg));
    }

    next();
};

export default validateRequest;
