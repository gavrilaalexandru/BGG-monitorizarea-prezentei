// error handler pentru diverse campuri, primar pentru prisma
exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A record with this unique field already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
