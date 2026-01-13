const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { validateEventGroup } = require("../middleware/validateRequest");

router.post("/groups", validateEventGroup, eventController.createEventGroup);
router.get(
  "/groups/organizer/:organizerId",
  eventController.getEventGroupsByOrganizer,
);
router.get("/:id", eventController.getEventById);
router.put("/:id/status", eventController.updateEventStatus);

module.exports = router;
