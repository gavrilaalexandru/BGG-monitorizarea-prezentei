const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { validateAttendance } = require("../middleware/validateRequest");
// configurarea rutelor pentru modulul express legat de prezenta
router.post("/", validateAttendance, attendanceController.markAttendance);
router.get("/event/:eventId", attendanceController.getEventAttendance);
router.get("/event/:eventId/export/csv", attendanceController.exportEventCSV);
router.get(
  "/group/:eventGroupId/export/xlsx",
  attendanceController.exportEventGroupXLSX,
);
router.get(
  "/participant/:participantId",
  attendanceController.getParticipantAttendances,
);

module.exports = router;
