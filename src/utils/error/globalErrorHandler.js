import i18n from "i18n";

import { apiError } from "../index.js";

// global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    // handle csrf token error
    if (err.code === "EBADCSRFTOKEN") {
        err.message = i18n.__("invalidCsrfToken");
    }

    res.status(err.status || 500).send(
        apiError(err.status || 500, err.message || "Internal Server Error")
    );
};

export default globalErrorHandler;
