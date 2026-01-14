import { useSelector } from "react-redux";
import OrganizerDashboard from "../components/OrganizerDashboard";
import ParticipantDashboard from "../components/ParticipantDashboard";
import Navbar from "../components/Navbar";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <Navbar />

      <div className="dashboard-content">
        {user?.role === "ORGANIZER" ? (
          <OrganizerDashboard />
        ) : (
          <ParticipantDashboard />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
