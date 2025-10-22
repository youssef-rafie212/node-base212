// create a standardized api error object
const apiError = (statusCode, translatedMessage, key = null, token = null) => {
    return {
        success: false,
        status: statusCode,
        message: translatedMessage,
        key: key ? key : undefined,
        token: token ? token : undefined,
    };
};

export default apiError;
