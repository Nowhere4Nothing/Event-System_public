import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventBar.css'; // Assuming you have styles

function EventBar({ event, onDelete}) {
  const navigate = useNavigate();

    const handleDelete = async () => {
      const confirmed = window.confirm(`Are you sure you want to delete "${event.eventName}"?`);
      if (!confirmed) return;

      try {
        const res = await fetch(`http://localhost:5000/events/${event.eventID}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          onDelete(event.eventID); // Notify parent to remove it from state
        } else {
          const error = await res.json();
          alert(`Failed to delete: ${error.error}`);
        }
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    };

    return (
      <div className="event-bar">
        <h3>{event.eventName}</h3>
        <p><label>Time:</label> {event.eventTime}, {event.eventDate}</p>
        <p><label>Venue ID:</label> {event.venueName}</p>
        <p><label>Performer:</label> {event.performer}</p>

        <div className="event-actions">
          <Link to={`/edit/${event.eventID}`}>
            <button className="edit-btn">Edit</button>
          </Link>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    );
  }

export default EventBar;