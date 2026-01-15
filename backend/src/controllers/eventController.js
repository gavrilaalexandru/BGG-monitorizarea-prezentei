const prisma = require("../prisma");
const { generateAccessCode } = require("../services/codeGenerator");
const { generateQRCode } = require("../services/qrCodeService");
const { syncEventStatus } = require("../services/eventService");
// creearea unui grup de evenimente cu generarea de coduri qr si de acces pentru evenimente
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
        const qrCode = await generateQRCode(accessCode);

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
// query la baza de date pentru un return json cu toate evenimentele
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
// query la baza de date pentru un return json cu toate grupurile de evenimente ale unui anumit organizator
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
// query la baza de date dupa pentru un return json cu un anume eveniment
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
// query la baza de date pentru a gasi un qr code aferent unui anumit eveniment (util la afisarea codului QR)
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

// adauga eveniment la un grup de evenimente existent
exports.addEventToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, startTime, endTime } = req.body;
    const organizerId = req.body.organizerId;

    const eventGroup = await prisma.eventGroup.findUnique({
      where: { id: groupId },
    });

    if (!eventGroup) {
      return res.status(404).json({ error: "Event group not found" });
    }

    if (eventGroup.organizerId !== organizerId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const accessCode = generateAccessCode();
    const qrCode = await generateQRCode(accessCode);

    const event = await prisma.event.create({
      data: {
        eventGroupId: groupId,
        name,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        accessCode,
        qrCode,
        status: "CLOSED",
      },
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// modifica un eveniment dintr-un grup de evenimente existent
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startTime, endTime, organizerId } = req.body;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventGroup: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.eventGroup.organizerId !== organizerId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// sterge un eveniment dintr-un grup de evenimente existent
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizerId } = req.body;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventGroup: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.eventGroup.organizerId !== organizerId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.attendance.deleteMany({
      where: { eventId: id },
    });

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
