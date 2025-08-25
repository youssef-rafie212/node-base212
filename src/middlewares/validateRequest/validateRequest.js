import { validationResult, matchedData } from "express-validator";

import { apiError } from "../../utils/index.js";

// middleware that checks for validation errors
const validateRequest = (req, res, next) => {
    // check for validation errors
    const errors = validationResult(req);

    // if there are errors, return the first one
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).send(apiError(400, firstError.msg));
    }

    // if no errors, get the validated data
    req.validatedData = matchedData(req);

    next();
};

export default validateRequest;
