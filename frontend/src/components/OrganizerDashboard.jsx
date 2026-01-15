import { useState, useEffect } from "react"; // eslint-disable-line no-unused-vars
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setEventGroups,
  setError,
  setLoading,
} from "../store/slices/eventsSlice";
import { getEventGroupsByOrganizer } from "../services/eventsService";
import "./OrganizerDashboard.css";

function OrganizerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { eventGroups, isLoading, error } = useSelector(
    (state) => state.events,
  );

  const loadEventGroups = async () => {
    try {
      dispatch(setLoading(true));
      const groups = await getEventGroupsByOrganizer(user.id);
      dispatch(setEventGroups(groups));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  useEffect(() => {
    loadEventGroups();
  }, []);

  const handleCreateNew = () => {
    navigate("/events/create");
  };

  const handleViewGroup = (groupId) => {
    navigate(`/events/group/${groupId}`);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-header">
        <h1>My Event Groups</h1>
        <button onClick={handleCreateNew} className="create-btn">
          + Create New Group
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {eventGroups.length === 0 ? (
        <div className="empty-state">
          <p>No event groups yet. Create your first one!</p>
        </div>
      ) : (
        <div className="groups-grid">
          {eventGroups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => handleViewGroup(group.id)}
            >
              <h3>{group.name}</h3>
              {group.description && <p>{group.description}</p>}
              <div className="group-info">
                <span>
                  {group.events?.length || 0}{" "}
                  {group.events?.length === 1 ? "event" : "events"}
                </span>
                <span className="view-link">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizerDashboard;
