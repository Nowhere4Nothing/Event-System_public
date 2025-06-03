import React, { useEffect, useState } from 'react';
import ViewTicketButton from './ViewTicketButton';
import './TicketEventBar.css';

function TicketEventBar({ ticket, eventID }) {
  const [transaction, setTransaction] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
      fetch('http://localhost:5000/transactions/' + ticket.ticketID)
        .then(res => res.json())
        .then(data => { 
          console.log('Fetched transaction details:', data);
          setTransaction(data);
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
        <span><h3>{transaction.eventName}</h3></span>
        <p>{transaction.eventDate}, {transaction.eventTime}</p>
        <span>Ticket {ticket.ticketID}, {ticket.ticketType}</span>
        <br />
        <ViewTicketButton ticket={transaction} />
      </div>
      )}
    </div>
  );
}

export default TicketEventBar;