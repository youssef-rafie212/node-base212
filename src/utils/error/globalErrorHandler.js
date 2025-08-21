import apiError from "../api/apiError.js";

const globalErrorHandler = (err, req, res, next) => {
    console.error(err);

    // handle csrf token error
    if (err.code === "EBADCSRFTOKEN") {
        err.message = i18n.__("invalidCsrfToken");
    }

    res.status(err.status || 500).send(
        apiError(err.status || 500, err.message || "Internal Server Error")
    );
}

export default globalErrorHandler;