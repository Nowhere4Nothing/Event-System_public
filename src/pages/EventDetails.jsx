import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatType, setSeatType] = useState('general');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>;
  }

  if (error || !event) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>{error || 'Event not found.'}</p>;
  }

  return (
    <div className="event-details-page">
      <h1 className="event-title">{event.eventName}</h1>

      <div className="event-content">
        <div className="ticket-section">
          <h2>Ticket Options</h2>
          <div className="ticket-option">
            <strong>General Admission</strong>
            <p>{event.price || '$TBD'}</p>
          </div>
          <div className="ticket-option">
            <strong>VIP</strong>
            <p>+ $50 Upgrade</p>
          </div>
        </div>

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
