import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketOptions, setTicketOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBuyNow = async () => {
    if (!selectedOption) return;

    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('userCookie='))
      ?.split('=')[1];

    if (!cookieValue) {
      alert('User not logged in.');
      return;
    }

    const userCookie = JSON.parse(decodeURIComponent(cookieValue));

    const payload = {
      eventID: event.eventID,
      username: userCookie.username,
      tickets: [
        {
          ticketOptionID: selectedOption.ticketOptionID,
          quantity: selectedOption.quantity,
        }
      ],
    };

    console.log('Payload being sent:', JSON.stringify(payload));

    try {
      const res = await fetch('http://localhost:5000/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const result = await res.json();
      if (res.ok) {
        alert('Purchase successful!');
      } else {
        alert('Purchase failed: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during purchase.');
    }
};


  //fetch event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Event not found');
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

  //fetch ticket options
  useEffect(() => {
    const fetchTicketOptions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ticketOptions/${id}`);
        if (!res.ok) throw new Error('Failed to fetch ticket options');
        const data = await res.json();
        setTicketOptions(data);
        if (data.length > 0) {
          setSelectedOption({ ...data[0], quantity: 1 });
        }
      } catch (err) {
        console.error('[TicketOptions] Error:', err);
      }
    };
    fetchTicketOptions();
  }, [id]);

  function formatDateToLocal(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (loading) return <p>Loading...</p>;
  if (error || !event) return <p>{error || 'Event not found.'}</p>;

  return (
  <div className="event-details-container">
    <div className="left-pane">
      <h1 className="event-title">{event.eventName}</h1>
      <div className="event-description">
        <p><strong>Description: </strong>{event.eventDesc}</p>
        <p className="event-date"><strong>Date: </strong>{formatDateToLocal(event.eventDate)}</p>
        <p className="event-time"><strong>Time: </strong>{event.eventTime}</p>
      </div>

      <div className="event-content">
        <div className="ticket-section">
          <h2>Ticket Options</h2>
          {ticketOptions.length === 0 ? (
            <p>No ticket options available.</p>
          ) : (
            <>
              <div className="seating-selector">
                <label htmlFor="ticket-type">Choose a ticket type:</label>
                <select
                  id="ticket-type"
                  value={selectedOption?.ticketOptionID || ''}
                  onChange={(e) => {
                    const option = ticketOptions.find(opt => opt.ticketOptionID === parseInt(e.target.value));
                    if (option) {
                      setSelectedOption({ ...option, quantity: 1 });
                    }
                  }}
                >
                  {ticketOptions.map(option => (
                    <option key={option.ticketOptionID} value={option.ticketOptionID}>
                      {option.ticketType} — ${option.price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOption && (
                <>
                  <div className="ticket-quantity">
                    <label htmlFor="ticket-quantity">Quantity:</label>
                    <select
                      id="ticket-quantity"
                      value={selectedOption.quantity || 1}
                      onChange={(e) => {
                        const updatedOption = { ...selectedOption, quantity: parseInt(e.target.value) };
                        setSelectedOption(updatedOption);
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="ticket-summary">
                    <p><strong>Selected:</strong> {selectedOption.ticketType}</p>
                    <p><strong>Total Price:</strong> ${selectedOption.price * (selectedOption.quantity || 1)}</p>
                  </div>
                </>
              )}

              <br/>

              <button className="buy-now-button" onClick={handleBuyNow}>
                Buy Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="right-pane">
      <img src="/images/event-placeholder.jpg" alt="Event Visual" className="event-image" />
    </div>
  </div>
  );


}

export default EventDetails;
