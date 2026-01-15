import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateEvent, getEventById } from "../services/eventsService";
import Navbar from "../components/Navbar";
import "./EditEvent.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEventById(id);
        setEventData({
          name: event.name || "",
          description: event.description || "",
          startTime: event.startTime?.slice(0, 16) || "",
          endTime: event.endTime?.slice(0, 16) || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, eventData);
      navigate(-1);
    } catch (err) {
      alert(`Failed to update event: ${err.message}`);
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

  return (
    <div>
      <Navbar />

      {/* Container centrat pentru întreaga pagină */}
      <div className="edit-event-container">
        {/* Formul propriu-zis */}
        <form onSubmit={handleSubmit} className="edit-event-card">
          <h1>Edit Event</h1>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                value={eventData.startTime}
                onChange={(e) =>
                  setEventData({ ...eventData, startTime: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>End Time *</label>
              <input
                type="datetime-local"
                value={eventData.endTime}
                onChange={(e) =>
                  setEventData({ ...eventData, endTime: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
