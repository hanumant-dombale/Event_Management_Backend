// Use single function to send success response.
const successResponse = (
    res,
    statusCode = 200,
    message = "Success",
    data = null,
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// Use single function to send error response.
const errorResponse = (
    res,
    statusCode = 500,
    message = "Something went wrong",
    error = null,
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error.message,
    });
};

export { successResponse, errorResponse };
