import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addEventGroup, setError } from "../store/slices/eventsSlice";
import { createEventGroup } from "../services/eventsService";
import Navbar from "../components/Navbar";
import "./CreateEventGroup.css";

function CreateEventGroup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [events, setEvents] = useState([
    {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
    },
  ]);

  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        name: "",
        description: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const handleRemoveEvent = (index) => {
    if (events.length > 1) {
      setEvents(events.filter((_, i) => i !== index));
    }
  };

  const handleEventChange = (index, field, value) => {
    const newEvents = [...events];
    newEvents[index][field] = value;
    setEvents(newEvents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const groupData = {
        name: formData.name,
        description: formData.description,
        organizerId: user.id,
        events: events.map((event) => ({
          name: event.name,
          description: event.description,
          startTime: new Date(event.startTime).toISOString(),
          endTime: new Date(event.endTime).toISOString(),
        })),
      };

      const newGroup = await createEventGroup(groupData);
      dispatch(addEventGroup(newGroup));
      navigate("/dashboard");
    } catch (err) {
      dispatch(
        setError(err.response?.data?.error || "Failed to create event group"),
      );
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="create-event-container">
        <div className="create-event-header">
          <h1>Create Event Group</h1>
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-section">
            <h2>Group Information</h2>

            <div className="form-group">
              <label>Group Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Web Technologies Labs"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Events</h2>
              <button
                type="button"
                onClick={handleAddEvent}
                className="add-event-btn"
              >
                + Add Event
              </button>
            </div>

            {events.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-card-header">
                  <h3>Event {index + 1}</h3>
                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Name *</label>
                    <input
                      type="text"
                      value={event.name}
                      onChange={(e) =>
                        handleEventChange(index, "name", e.target.value)
                      }
                      placeholder="e.g., Lab 1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={event.description}
                    onChange={(e) =>
                      handleEventChange(index, "description", e.target.value)
                    }
                    placeholder="Optional..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time *</label>
                    <input
                      type="datetime-local"
                      value={event.startTime}
                      onChange={(e) =>
                        handleEventChange(index, "startTime", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Time *</label>
                    <input
                      type="datetime-local"
                      value={event.endTime}
                      onChange={(e) =>
                        handleEventChange(index, "endTime", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Event Group"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventGroup;
