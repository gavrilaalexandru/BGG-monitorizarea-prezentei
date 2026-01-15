// middleware pentru validarea diverselor campuri ale userului
exports.validateUser = (req, res, next) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "Name, email and role are required" });
  }

  if (!["ORGANIZER", "PARTICIPANT"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Role must be ORGANIZER or PARTICIPANT" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  next();
};
// validarea grupurilor de evenimente
exports.validateEventGroup = (req, res, next) => {
  const { name, organizerId, events } = req.body;

  if (!name || !organizerId) {
    return res.status(400).json({ error: "Name and organizerId are required" });
  }

  if (!events || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "At least one event is required" });
  }

  for (const event of events) {
    if (!event.name || !event.startTime || !event.endTime) {
      return res
        .status(400)
        .json({ error: "Each event must have name, startTime and endTime" });
    }

    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    if (start >= end) {
      return res
        .status(400)
        .json({ error: "Event end time must be after start time" });
    }
  }

  next();
};
// verificarea prezentei
exports.validateAttendance = (req, res, next) => {
  const { accessCode, participantId } = req.body;

  if (!accessCode || !participantId) {
    return res
      .status(400)
      .json({ error: "Access code and participant ID are required" });
  }

  next();
};

// validare pentru adaugare eveniment individual
exports.validateEvent = (req, res, next) => {
  const { name, startTime, endTime } = req.body;

  if (!name || !startTime || !endTime) {
    return res.status(400).json({
      error: "Name, startTime and endTime are required",
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: "Invalid date format",
    });
  }

  if (start >= end) {
    return res.status(400).json({
      error: "Event end time must be after start time",
    });
  }

  next();
};
