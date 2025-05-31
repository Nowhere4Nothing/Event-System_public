import React, { useEffect, useState } from 'react';
import './TicketEventBar.css';

function TicketEventBar({ ticket, eventID }) {
  const [myEvent, setMyEvent] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
      fetch('http://localhost:5000/events/' + eventID)
        .then(res => res.json())
        .then(data => { 
          console.log('Fetched event:', data);
          setMyEvent(data);
          setLoadingEvent(false);
        })
        .catch(err => {
          console.error('Error fetching events:', err);
          setLoadingEvent(false);
        });
    }, []
  );

  return (
    <div className="ticket-event-bar">
      {loadingEvent ? <p>Loading event details...</p> : (
      <div>
        <span><h3>{myEvent.eventName}</h3></span>
        <p>{myEvent.eventDate}, {myEvent.eventTime}</p>
        <span>Ticket {ticket.ticketID}, {ticket.ticketType}</span>
      </div>
      )}
    </div>
  );
}

export default TicketEventBar;