// create a standardized api response object
const apiResponse = (
    statusCode,
    translatedMessage,
    data = {},
    totalCount,
    currentPage,
    totalPages
) => {
    return {
        success: true,
        status: statusCode,
        message: translatedMessage,
        data,
        totalCount,
        currentPage,
        totalPages,
    };
};

export default apiResponse;
