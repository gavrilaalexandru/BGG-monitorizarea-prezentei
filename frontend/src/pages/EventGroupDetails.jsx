import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getEventGroupsByOrganizer,
  exportEventGroupXLSX,
} from "../services/eventsService";
import Navbar from "../components/Navbar";
import "./EventGroupDetails.css";

function EventGroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [eventGroup, setEventGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      alert(`Failed to export data: ${err.message}`);
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
          <button onClick={handleExport} className="export-btn">
            Export All (XLSX)
          </button>
        </div>

        <div className="events-list">
          {eventGroup.events && eventGroup.events.length > 0 ? (
            eventGroup.events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event.id}
                  className={`event-item ${status}`}
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="event-info">
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
                  <div className="event-arrow">→</div>
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
