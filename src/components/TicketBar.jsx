import React from 'react';
import ViewTicketButton from './ViewTicketButton';
import './TicketBar.css'; // Assuming you have styles

function TicketBar({ ticket }) {
  return (
    <div className="ticket-bar">
      <span><h3>{ticket.ticketID}</h3> ({ticket.ticketType})</span>
      <p><label>Owner:</label> {ticket.username}</p>
      <ViewTicketButton ticket={ticket} />
    </div>
  );
}

export default TicketBar;