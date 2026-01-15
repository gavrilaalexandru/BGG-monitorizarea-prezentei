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

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      dispatch(setError("New password must be at least 6 characters"));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }
    if (user && newPassword === currentPassword) {
      dispatch(
        setError("New password must be different from current password"),
      );
      return;
    }

    setIsLoading(true);
    try {
      const payload = user
        ? { userId: user.id, currentPassword, newPassword }
        : { email, currentPassword, newPassword };

      await changePassword(payload);

      setToastMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(setError(""));

      setTimeout(() => {
        setToastMessage("");
        if (user) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
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
      {user && <Navbar />}

      {toastMessage && <div className="toast-message">{toastMessage}</div>}

      <div className="change-password-container">
        <form onSubmit={handleSubmit} className="change-password-card">
          <h1>{user ? "Change Password" : "Reset Password"}</h1>

          {error && <div className="error-message">{error}</div>}

          {!user && (
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
          )}

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
              onClick={() => navigate(user ? "/dashboard" : "/")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : user
                  ? "Change Password"
                  : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
