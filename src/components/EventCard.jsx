import React from 'react';
import './EventCard.css'; // Assuming you have styles
import { useNavigate } from 'react-router-dom';


function EventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.eventID}`); // assuming eventID matches what's expected in EventDetails
  };

  return (
    <div className="event-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
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