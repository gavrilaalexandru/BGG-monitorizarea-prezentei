const prisma = require("../prisma");
const { exportToCSV, exportToXLSX } = require("../services/exportService");
// validarea participantului, al codului de acces, verificarea daca evenimentul poate fi accesat si daca prezenta a fost deja pusa, crearea in baza de date a prezentei
exports.markAttendance = async (req, res) => {
  try {
    const { accessCode, participantId } = req.body;

    const participant = await prisma.user.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    const event = await prisma.event.findUnique({
      where: { accessCode },
    });

    if (!event) {
      return res.status(404).json({ error: "Invalid access code" });
    }

    if (event.status !== "OPEN") {
      return res
        .status(400)
        .json({ error: "Event is not open for attendance" });
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        eventId_participantId: {
          eventId: event.id,
          participantId,
        },
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: "Attendance already marked" });
    }

    const attendance = await prisma.attendance.create({
      data: {
        eventId: event.id,
        participantId,
      },
      include: {
        participant: true,
        event: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// query la baza de date pentru un return json cu prezenta la un anumit eveniment
exports.getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: { participant: true },
      orderBy: { checkInTime: "asc" },
    });

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exportarea unui eveniment in CSV
exports.exportEventCSV = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: {
        participant: true,
        event: true,
      },
    });

    const csvData = exportToCSV(attendances);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance-${eventId}.csv`,
    );
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// exportarea unui grup de evenimente in XLSX
exports.exportEventGroupXLSX = async (req, res) => {
  try {
    const { eventGroupId } = req.params;

    const eventGroup = await prisma.eventGroup.findUnique({
      where: { id: eventGroupId },
      include: {
        events: {
          include: {
            attendances: {
              include: { participant: true },
            },
          },
        },
      },
    });

    if (!eventGroup) {
      return res.status(404).json({ error: "Event group not found" });
    }

    const buffer = await exportToXLSX(eventGroup);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance-${eventGroupId}.xlsx`,
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
