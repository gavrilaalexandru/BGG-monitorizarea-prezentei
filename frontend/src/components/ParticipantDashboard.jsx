import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  markAttendance,
  getParticipantAttendances,
} from "../services/eventsService";
import QRScanner from "./QRScanner";
import "./ParticipantDashboard.css";

function ParticipantDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showScanner, setShowScanner] = useState(false);
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data = await getParticipantAttendances(user.id);
      setAttendances(data);
    } catch (err) {
      console.error("Failed to load attendances:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitAttendance(accessCode);
  };

  const submitAttendance = async (code) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await markAttendance(code, user.id);
      setMessage({
        type: "success",
        text: "Attendance marked successfully! ✓",
      });
      setAccessCode("");
      setShowScanner(false);
      loadAttendances();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to mark attendance",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = (decodedText) => {
    submitAttendance(decodedText);
  };

  return (
    <div className="participant-dashboard">
      <div className="dashboard-header">
        <h1>Mark Attendance</h1>
        <p>Enter the access code or scan QR code</p>
      </div>

      <div className="attendance-card">
        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Access Code</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., ABC123)"
              required
              maxLength={6}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Marking..." : "Mark Attendance"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={() => setShowScanner(true)} className="scan-btn">
          Scan QR Code
        </button>
      </div>

      {attendances.length > 0 && (
        <div className="attendance-history">
          <h2>My Attendance History</h2>
          <div className="history-list">
            {attendances.map((att) => (
              <div key={att.id} className="history-item">
                <div className="history-info">
                  <strong>{att.event.name}</strong>
                  <span className="history-group">
                    {att.event.eventGroup?.name}
                  </span>
                  <span className="history-date">
                    {new Date(att.checkInTime).toLocaleString("ro-RO")}
                  </span>
                </div>
                <span className="history-check">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

export default ParticipantDashboard;
