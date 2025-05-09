import React from 'react';
import './EventBar.css'; // Assuming you have styles

function EventBar({ event }) {
  return (
    <div className="event-bar">
      <h3>{event.eventName}</h3>
      <p><label>Time:</label> {event.eventTime}, {event.eventDate}</p>
      <p><label>Venue ID:</label> {event.venueName}</p>
      <p><label>Performer:</label> {event.performer}</p>
    </div>
  );
}

export default EventBar;