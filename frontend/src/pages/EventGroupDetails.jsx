import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getEventGroupsByOrganizer,
  exportEventGroupXLSX,
  deleteEvent,
  addEventToGroup,
} from "../services/eventsService";
import Navbar from "../components/Navbar";
import "./EventGroupDetails.css";

function EventGroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [eventGroup, setEventGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    loadEventGroup();
  }, [id]);

  const loadEventGroup = async () => {
    try {
      const groups = await getEventGroupsByOrganizer(user.id);
      const group = groups.find((g) => g.id === id);
      setEventGroup(group);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleExport = async () => {
    try {
      const blob = await exportEventGroupXLSX(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventGroup.name}-attendance.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Failed to export data ${err.message}`);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"?`)) {
      return;
    }

    try {
      await deleteEvent(eventId, user.id);
      await loadEventGroup();
    } catch (err) {
      alert(`Failed to delete event ${err.message}`);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      await addEventToGroup(id, {
        ...newEvent,
        organizerId: user.id,
      });
      setShowAddEvent(false);
      setNewEvent({ name: "", description: "", startTime: "", endTime: "" });
      await loadEventGroup();
    } catch (err) {
      alert(`Failed to add event ${err.message}`);
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    if (now < start) return "upcoming";
    if (now > end) return "closed";
    return "open";
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!eventGroup) {
    return (
      <div>
        <Navbar />
        <div className="error">Event group not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="event-group-container">
        <div className="event-group-header">
          <div>
            <button onClick={() => navigate("/dashboard")} className="back-btn">
              ← Back
            </button>
            <h1>{eventGroup.name}</h1>
            {eventGroup.description && <p>{eventGroup.description}</p>}
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowAddEvent(true)}
              className="add-event-btn"
            >
              + Add Event
            </button>
            <button onClick={handleExport} className="export-btn">
              Export All (XLSX)
            </button>
          </div>
        </div>

        {showAddEvent && (
          <div className="add-event-form-container">
            <form onSubmit={handleAddEvent} className="add-event-form">
              <h3>Add New Event</h3>

              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="events-list">
          {eventGroup.events && eventGroup.events.length > 0 ? (
            eventGroup.events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div key={event.id} className={`event-item ${status}`}>
                  <div
                    className="event-info"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <h3>{event.name}</h3>
                    {event.description && <p>{event.description}</p>}
                    <div className="event-meta">
                      <span>
                        {new Date(event.startTime).toLocaleString("ro-RO")}
                      </span>
                      <span className={`status-badge ${status}`}>
                        {status === "open"
                          ? "OPEN"
                          : status === "upcoming"
                            ? "Upcoming"
                            : "Closed"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id, event.name);
                    }}
                    className="delete-event-btn"
                    title="Delete event"
                  >
                    Delete
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/edit/${event.id}`);
                    }}
                    className="edit-event-btn"
                    title="Edit event"
                  >
                    Edit
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty-state">No events in this group</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventGroupDetails;
