const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { validateAttendance } = require("../middleware/validateRequest");

router.post("/", validateAttendance, attendanceController.markAttendance);
router.get("/event/:eventId", attendanceController.getEventAttendance);
router.get("/event/:eventId/export/csv", attendanceController.exportEventCSV);
router.get(
  "/group/:eventGroupId/export/xlsx",
  attendanceController.exportEventGroupXLSX,
);

module.exports = router;
