import React, { useEffect, useState } from 'react';
import ViewTicketButton from './ViewTicketButton';
import './TicketEventBar.css';

function TicketEventBar({ ticket, eventID }) {
  const [transaction, setTransaction] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [refunded, setRefunded] = useState(false);

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
  }, [ticket.ticketID]);

  const handleRefund = () => {
    const confirmRefund = window.confirm('Are you sure you want to refund this ticket? This action cannot be undone.');

    if (confirmRefund) {
      fetch(`http://localhost:5000/tickets/${ticket.ticketID}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          setRefunded(true);
          alert('Ticket refunded successfully.');
        } else {
          throw new Error('Failed to refund the ticket.');
        }
      })
      .catch(err => {
        console.error('Error processing refund:', err);
        alert('Something went wrong. Ticket was not refunded.');
      });
    }
  };

  if (refunded) {
    return (
      <div className="ticket-event-bar refunded">
        <p>This ticket has been refunded.</p>
      </div>
    );
  }

  return (
    <div className="ticket-event-bar">
      {loadingEvent ? <p>Loading event details...</p> : (
        <div className="ticket-content">
          <div className="ticket-info">
            <h3>{transaction.eventName}</h3>
            <p>Date/Time: {transaction.eventDate}, {transaction.eventTime}</p>
            <p>Ticket: {ticket.ticketType}</p>
          </div>
          <div className="ticket-buttons">
            <ViewTicketButton ticket={transaction} className="view-ticket-button" />
            <button onClick={handleRefund} className="refund-button">Refund Ticket</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketEventBar;
