import React from 'react';
import './EventCard.css'; // Assuming you have styles

function EventCard({ event }) {
  return (
    <div className="event-card">
      <h3>{event.eventName}</h3>
      <p>{event.eventDesc}</p>
      <p>Date: {event.eventDate}</p>
      <p>Time: {event.eventTime}</p>
      <p>Venue ID: {event.venueName}</p>
      <p>Performer: {event.performer}</p>
    </div>
  );
}

export default EventCard;