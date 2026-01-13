require("dotenv").config();
const express = require("express");
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require("./routes/userRoutes");

const { requestLogger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "Attendance API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
