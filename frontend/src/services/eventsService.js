import api from "./api";

export const getEventGroupsByOrganizer = async (organizerId) => {
  const response = await api.get(`/events/groups/organizer/${organizerId}`);
  return response.data;
};

export const createEventGroup = async (groupData) => {
  const response = await api.post("/events/groups", groupData);
  return response.data;
};

export const addEventToGroup = async (groupId, eventData) => {
  const response = await api.post(
    `/events/groups/${groupId}/events`,
    eventData,
  );
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId, organizerId) => {
  const response = await api.delete(`/events/${eventId}`, {
    data: { organizerId },
  });
  return response.data;
};

export const getEventById = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

export const getEventQRCode = async (eventId) => {
  const response = await api.get(`/events/${eventId}/qrcode`);
  return response.data;
};

export const getEventAttendance = async (eventId) => {
  const response = await api.get(`/attendance/event/${eventId}`);
  return response.data;
};

export const getParticipantAttendances = async (participantId) => {
  const response = await api.get(`/attendance/participant/${participantId}`);
  return response.data;
};

export const markAttendance = async (accessCode, participantId) => {
  const response = await api.post("/attendance", {
    accessCode,
    participantId,
  });
  return response.data;
};

export const exportEventCSV = async (eventId) => {
  const response = await api.get(`/attendance/event/${eventId}/export/csv`, {
    responseType: "blob",
  });
  return response.data;
};

export const exportEventGroupXLSX = async (eventGroupId) => {
  const response = await api.get(
    `/attendance/group/${eventGroupId}/export/xlsx`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};
