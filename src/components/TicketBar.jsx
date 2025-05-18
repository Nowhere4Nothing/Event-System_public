import React from 'react';
import './TicketBar.css'; // Assuming you have styles

function TicketBar({ ticket }) {
  return (
    <div className="ticket-bar">
      <span><h3>{ticket.ticketID}</h3> ({ticket.ticketType})</span>
      <p><label>Owner:</label> {ticket.username}</p>
    </div>
  );
}

export default TicketBar;