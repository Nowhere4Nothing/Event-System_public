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
        console.log(`[EventDetails] Fetching event with ID: ${id}`);
        const response = await fetch(`http://localhost:5000/events/${id}`, {credentials: 'include'});
        if (!response.ok) {
          console.error(`[EventDetails] Failed to fetch event. Status: ${response.status}`);
          throw new Error('Event not found');
        }
        const data = await response.json();
        console.log('[EventDetails] Event data received:', data);
        setEvent(data);
      } catch (err) {
        console.error('[EventDetails] Error fetching event:', err.message);
        setError(err.message);
      } finally {
        console.log('[EventDetails] Fetch complete. Updating loading state to false.');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    console.log('[EventDetails] Currently loading...');
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>;
  }

  if (error || !event) {
    console.warn('[EventDetails] Displaying error state.');
    return <p style={{ padding: '2rem', textAlign: 'center' }}>{error || 'Event not found.'}</p>;
  }

  function formatDateToLocal(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  console.log('[EventDetails] Rendering event details:', event);

  return (
    <div className="event-details-page">
      <h1 className="event-title">
        {event.eventName}
      </h1>
      <div className="event-description" data-testid="event-description">
        <p>{event.eventDesc}</p>
        <p className="event-date" data-testid="event-date">
          {formatDateToLocal(event.eventDate)}
        </p>
        <p className="event-time" data-testid="event-time">
          {event.eventTime}
        </p>
      </div>
      <div className="event-content">
        <div className="ticket-section">
          <h2>Ticket Options</h2>
          <div className="ticket-option">
            <strong>Selected:</strong>{' '}
            {seatType === 'general' && 'General Admission'}
            {seatType === 'reserved' && 'Reserved Seating'}
            {seatType === 'vip' && 'VIP Lounge'}
            <p>{event.price || '$TBD'}</p>
          </div>
          <div className="ticket-option">
            <strong>VIP</strong>
            <p>+ $50 Upgrade</p>
          </div>
          <div className="ticket-total">
            <strong>Total: {event.total}</strong>
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

          <div className="ticket-preview">
            <h3>Selected Seating:</h3>
            <p>
              {seatType === 'general' && 'General Admission'}
              {seatType === 'reserved' && 'Reserved Seating'}
              {seatType === 'vip' && 'VIP Lounge'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
