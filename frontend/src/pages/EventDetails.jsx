import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  getEventAttendance,
  exportEventCSV,
} from "../services/eventsService";
import Navbar from "../components/Navbar";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [id]);

  useEffect(() => {
    if (autoRefresh && event?.status === "OPEN") {
      const interval = setInterval(() => {
        loadAttendances();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, event]);

  const loadEventData = async () => {
    try {
      const eventData = await getEventById(id);
      setEvent(eventData);
      await loadAttendances();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAttendances = async () => {
    try {
      const data = await getEventAttendance(id);
      setAttendances(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportEventCSV(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.name}-attendance.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Failed to export data ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Navbar />
        <div className="error">Event not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="event-details-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="event-header">
          <div>
            <h1>{event.name}</h1>
            {event.description && <p>{event.description}</p>}
            <div className="event-time">
              {new Date(event.startTime).toLocaleString("ro-RO")} -{" "}
              {new Date(event.endTime).toLocaleString("ro-RO")}
            </div>
          </div>
          <div className={`status-badge ${event.status.toLowerCase()}`}>
            {event.status === "OPEN" ? "OPEN" : "CLOSED"}
          </div>
        </div>

        <div className="content-grid">
          <div className="qr-section">
            <div className="card">
              <h2>Access Code</h2>
              <div className="access-code-display">{event.accessCode}</div>

              {event.qrCode && (
                <div className="qr-code-container">
                  <img
                    src={event.qrCode}
                    alt="QR Code"
                    className="qr-code-image"
                  />
                  <p className="qr-hint">
                    Show this QR code for students to scan
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="participants-section">
            <div className="card">
              <div className="participants-header">
                <h2>Participants ({attendances.length})</h2>
                <div className="participants-actions">
                  <label className="auto-refresh">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    Auto-refresh
                  </label>
                  <button
                    onClick={handleExportCSV}
                    className="export-btn-small"
                  >
                    CSV
                  </button>
                </div>
              </div>

              {attendances.length === 0 ? (
                <div className="empty-participants">No participants yet</div>
              ) : (
                <div className="participants-list">
                  {attendances.map((attendance) => (
                    <div key={attendance.id} className="participant-item">
                      <div className="participant-info">
                        <strong>{attendance.participant.name}</strong>
                        <span className="participant-email">
                          {attendance.participant.email}
                        </span>
                      </div>
                      <div className="check-in-time">
                        ✓{" "}
                        {new Date(attendance.checkInTime).toLocaleTimeString(
                          "ro-RO",
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
