const prisma = require("../prisma");
const { generateAccessCode } = require("../services/codeGenerator");
const { generateQRCode } = require("../services/qrCodeService");
const { syncEventStatus } = require("../services/eventService");

exports.createEventGroup = async (req, res) => {
  try {
    const { name, description, organizerId, events } = req.body;

    const organizer = await prisma.user.findUnique({
      where: { id: organizerId },
    });

    if (!organizer) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    if (organizer.role !== "ORGANIZER") {
      return res.status(403).json({ error: "User is not an organizer" });
    }

    const eventsWithQR = await Promise.all(
      events.map(async (event) => {
        const accessCode = generateAccessCode();
        const qrCode = await generateQRCodeDataURL(accessCode);

        return {
          name: event.name,
          description: event.description,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          accessCode: accessCode,
          qrCode: qrCode,
          status: "CLOSED",
        };
      }),
    );

    const eventGroup = await prisma.eventGroup.create({
      data: {
        name,
        description,
        organizerId,
        events: {
          create: eventsWithQR,
        },
      },
      include: { events: true },
    });

    res.status(201).json(eventGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEventGroups = async (req, res) => {
  try {
    const eventGroups = await prisma.eventGroup.findMany({
      include: { events: true },
    });
    res.json(eventGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventGroupsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const eventGroups = await prisma.eventGroup.findMany({
      where: { organizerId },
      include: { events: true },
    });

    res.json(eventGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventGroup: true,
        attendances: {
          include: { participant: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const updatedEvent = await syncEventStatus(event);

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, name: true, accessCode: true, qrCode: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      eventId: event.id,
      eventName: event.name,
      accessCode: event.accessCode,
      qrCode: event.qrCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
