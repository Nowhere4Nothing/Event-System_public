import React from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

function EventCard({ id, title, date, location, price }) {
  return (
    <Link to={`/events/${id}`} className="event-card-link">
      <div className="event-card">
        <h3>{title}</h3>
        <p>{date}</p>
        <p>{location}</p>
        <p>{price}</p>
      </div>
    </Link>
  );
}

export default EventCard;
