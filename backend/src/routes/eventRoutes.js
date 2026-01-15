const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const {
  validateEventGroup,
  validateEvent,
} = require("../middleware/validateRequest");
// configurarea rutelor pentru modulul express legat de evenimente
router.post("/groups", validateEventGroup, eventController.createEventGroup);
router.get(
  "/groups/organizer/:organizerId",
  eventController.getEventGroupsByOrganizer,
);
router.get("/:id", eventController.getEventById);
router.get("/", eventController.getAllEventGroups);
router.get("/:id/qrcode", eventController.getEventQRCode);

router.post(
  "/groups/:groupId/events",
  validateEvent,
  eventController.addEventToGroup,
);
router.put("/:id", validateEvent, eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
