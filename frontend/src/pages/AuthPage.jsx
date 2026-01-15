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
  const [loginPassword, setLoginPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PARTICIPANT",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(loginEmail, loginPassword);
      dispatch(loginSuccess(user));
      navigate("/dashboard");
    } catch (err) {
      dispatch(setError(err.response?.data?.error || "Login failed"));
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validare parolă
    if (registerData.password.length < 6) {
      dispatch(setError("Password must be at least 6 characters"));
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      dispatch(setError("Passwords do not match"));
      return;
    }

    try {
      const user = await registerUser({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
      });
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

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Login
            </button>

            <p className="reset-password-text">
              Forgot password?{" "}
              <button
                type="button"
                className="reset-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/change-password");
                }}
              >
                Reset here
              </button>
            </p>
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
              <label>Password</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Repeat password"
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
