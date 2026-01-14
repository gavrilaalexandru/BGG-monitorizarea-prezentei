// middleware pentru logarea tuturor cererilor care ajung la server
exports.requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};
