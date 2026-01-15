import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            BGG Attendance
          </h2>
        </div>

        {user && (
          <div className="navbar-user">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
            <button
              onClick={handleChangePassword}
              className="change-password-btn"
            >
              Change Password
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
