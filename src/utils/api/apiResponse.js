const apiResponse = (statusCode, translatedMessage, data = {}) => {
    return {
        success: true,
        status: statusCode,
        message: translatedMessage,
        data,
    };
};

export default apiResponse;
