const apiError = (statusCode, translatedMessage) => {
    return {
        success: false,
        status: statusCode,
        message: translatedMessage,
    };
};

export default apiError;
