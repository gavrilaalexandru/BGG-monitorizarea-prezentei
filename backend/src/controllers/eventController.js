const prisma = require("../prisma");
const { generateAccessCode } = require("../services/codeGenerator");
const { syncEventStatus } = require("../services/eventService");

exports.createEventGroup = async (req, res) => {
  try {
    const { name, description, organizerId, events } = req.body;

    const eventGroup = await prisma.eventGroup.create({
      data: {
        name,
        description,
        organizerId,
        events: {
          create: events.map((event) => ({
            name: event.name,
            description: event.description,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            accessCode: generateAccessCode(),
            status: "CLOSED",
          })),
        },
      },
      include: { events: true },
    });

    res.status(201).json(eventGroup);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
