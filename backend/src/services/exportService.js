const XLSX = require("xlsx");
// export spre csv (pentru un singur eveniment)
exports.exportToCSV = (attendances) => {
  let csv = "Event Name,Participant Name,Participant Email,Check-in Time\n";

  attendances.forEach((att) => {
    csv += `"${att.event.name}","${att.participant.name}","${att.participant.email}","${att.checkInTime}"\n`;
  });

  return csv;
};
// export spre xlsx (pentru event group)
exports.exportToXLSX = async (eventGroup) => {
  const workbook = XLSX.utils.book_new();

  eventGroup.events.forEach((event) => {
    const data = event.attendances.map((att) => ({
      "Event Name": event.name,
      "Participant Name": att.participant.name,
      "Participant Email": att.participant.email,
      "Check-in Time": att.checkInTime.toISOString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      event.name.substring(0, 31),
    );
  });

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};
