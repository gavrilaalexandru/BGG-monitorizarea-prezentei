const prisma = require("../prisma");

exports.syncEventStatus = async (event) => {
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  let status = event.status;

  if (now >= startTime && now <= endTime) {
    status = "OPEN";
  } else {
    status = "CLOSED";
  }

  if (status !== event.status) {
    return await prisma.event.update({
      where: { id: event.id },
      data: { status: status },
    });
  }

  return event;
};
