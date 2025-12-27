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

export { successResponse };
