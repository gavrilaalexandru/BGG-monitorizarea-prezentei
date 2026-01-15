import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setError } from "../store/slices/authSlice";
import { changePassword } from "../services/auth";
import Navbar from "../components/Navbar";
import "./ChangePassword.css";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, user } = useSelector((state) => state.auth);

  const [toastMessage, setToastMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      dispatch(setError("You must be logged in to change password"));
      return;
    }

    if (newPassword.length < 6) {
      dispatch(setError("New password must be at least 6 characters"));
      return;
    }

    if (newPassword !== confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }

    if (newPassword === currentPassword) {
      dispatch(
        setError("New password must be different from current password"),
      );
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ userId: user.id, currentPassword, newPassword });
      setToastMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(setError(""));
      setTimeout(() => {
        setToastMessage("");
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      dispatch(
        setError(err.response?.data?.error || "Failed to change password"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {toastMessage && <div className="toast-message">{toastMessage}</div>}

      <div className="change-password-container">
        <form onSubmit={handleSubmit} className="change-password-card">
          <h1>Change Password</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat password"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
