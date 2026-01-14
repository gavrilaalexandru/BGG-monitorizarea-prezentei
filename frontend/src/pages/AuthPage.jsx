import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginSuccess,
  registerSuccess,
  setError,
} from "../store/slices/authSlice";
import { loginUser, registerUser } from "../services/auth";
import "./AuthPage.css";

function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const [showLogin, setShowLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    role: "PARTICIPANT",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(loginEmail);
      dispatch(loginSuccess(user));
      navigate("/dashboard");
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(registerData);
      dispatch(registerSuccess(user));
      navigate("/dashboard");
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Registration failed"));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>BGG Attendance</h1>
          <p>Monitoring made simple</p>
        </div>

        <div className="auth-toggle">
          <button
            onClick={() => setShowLogin(true)}
            className={showLogin ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={!showLogin ? "active" : ""}
          >
            Register
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={registerData.role}
                onChange={(e) =>
                  setRegisterData({ ...registerData, role: e.target.value })
                }
              >
                <option value="PARTICIPANT">Participant</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
