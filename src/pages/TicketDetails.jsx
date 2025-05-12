import React from 'react';
import './TicketDetails.css';

function TicketDetails({ ticketID }) {
  // Mock data
  const mockTicket = {
    ticketID: 'T12345',
    ticketType: 'VIP',
    ticketPrice: '$150',
  };

  const mockEvent = {
    eventName: 'Tech Conference 2025',
    eventType: 'Conference',
    eventDate: '2025-06-10',
    venueName: 'Sydney Conference Hall',
    eventDesc: 'An annual tech conference bringing together industry leaders.',
    eventTime: '09:00 AM',
    performer: 'Keynote Speaker: John Doe',
    organiser: 'Tech Events Ltd',
  };
  // Retrieve from DB when functional
  const ticket = mockTicket;
  const event = mockEvent;

  const handleRefund = () => {
    alert(`Refund requested for Ticket ID: ${ticket.ticketID}`);
    // temp alert -  Add refund logic here
  };

  return (
    <div className="ticket-details-page">
      <h1 className="ticket-title">Ticket Details</h1>

      <div className="ticket-content">
        <div className="event-details-section">
          <h2>Event Details</h2>
          <p><strong>Name:</strong> {event.eventName}</p>
          <p><strong>Type:</strong> {event.eventType}</p>
          <p><strong>Date:</strong> {event.eventDate}</p>
          <p><strong>Venue:</strong> {event.venueName}</p>
          <p><strong>Description:</strong> {event.eventDesc}</p>
          <p><strong>Time:</strong> {event.eventTime}</p>
          <p><strong>Performer:</strong> {event.performer}</p>
          <p><strong>Organiser:</strong> {event.organiser}</p>
        </div>

        <div className="ticket-details-section">
          <h2>Your Ticket</h2>
          <p><strong>Ticket ID:</strong> {ticket.ticketID}</p>
          <p><strong>Type:</strong> {ticket.ticketType}</p>
          <p><strong>Price:</strong> {ticket.ticketPrice}</p>
          <button className="refund-button" onClick={handleRefund}>
            Refund
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;