import { useState } from "react";
import { useSelector } from "react-redux";
import { markAttendance } from "../services/eventsService";
import QRScanner from "./QRScanner";
import "./ParticipantDashboard.css";

function ParticipantDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showScanner, setShowScanner] = useState(false);

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
