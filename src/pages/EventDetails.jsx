import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetails.css';

const allEvents = [
  { id: '1', title: 'Tech Conference 2025', date: '2025-06-10', location: 'Sydney', price: '$99' },
  { id: '2', title: 'Startup Pitch Night', date: '2025-07-03', location: 'Melbourne', price: 'Free' },
  { id: '3', title: 'Wine & Art Expo', date: '2025-08-15', location: 'Brisbane', price: '$49' },
  { id: '4', title: 'React Developers Meetup', date: '2025-09-05', location: 'Online', price: 'Free' },
  { id: '5', title: 'AI & Machine Learning Expo', date: '2025-10-15', location: 'Sydney', price: '$120' },
  { id: '6', title: 'Blockchain Summit 2025', date: '2025-11-20', location: 'Melbourne', price: '$80' },
];

function EventDetails() {
  const { id } = useParams();
  const [seatType, setSeatType] = useState('general');

  const event = allEvents.find((e) => e.id === id);

  if (!event) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Event not found.</p>;
  }

  return (
    <div className="event-details-page">
      <h1 className="event-title">{event.title}</h1>

      <div className="event-content">
        {/* Ticket Options */}
        <div className="ticket-section">
          <h2>Ticket Options</h2>
          <div className="ticket-option">
            <strong>General Admission</strong>
            <p>{event.price}</p>
          </div>
          <div className="ticket-option">
            <strong>VIP</strong>
            <p>+ $50 Upgrade</p>
          </div>
        </div>

        {/* Seating Map or Selector */}
        <div className="seating-section">
          <h2>Seating Area</h2>
          <div className="seating-selector">
            <label htmlFor="seating">Choose a seating type:</label>
            <select
              id="seating"
              value={seatType}
              onChange={(e) => setSeatType(e.target.value)}
            >
              <option value="general">General Admission</option>
              <option value="reserved">Reserved Seating</option>
              <option value="vip">VIP Lounge</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
