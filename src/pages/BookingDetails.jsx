import React from 'react';
import './BookingDetails.css';
import TicketBar from '../components/TicketBar';

function BookingDetails() {
  // need to get DB data when ready -- needs cookies
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

  const mockTickets = [
    { ticketID: 'T12345', ticketType: 'VIP', username: 'johndoe' },
    { ticketID: 'T12346', ticketType: 'General', username: 'janedoe' },
    { ticketID: 'T12347', ticketType: 'VIP', username: 'alice' },
    { ticketID: 'T12348', ticketType: 'General', username: 'bob' },
  ];

  return (
    <div className="booking-details-page">
      <h1 className="booking-title">Booking Details</h1>

      <div className="booking-content">
        <div className="event-details-section">
          <h2>Event Details</h2>
          <p><strong>Name:</strong> {mockEvent.eventName}</p>
          <p><strong>Type:</strong> {mockEvent.eventType}</p>
          <p><strong>Date:</strong> {mockEvent.eventDate}</p>
          <p><strong>Venue:</strong> {mockEvent.venueName}</p>
          <p><strong>Description:</strong> {mockEvent.eventDesc}</p>
          <p><strong>Time:</strong> {mockEvent.eventTime}</p>
          <p><strong>Performer:</strong> {mockEvent.performer}</p>
          <p><strong>Organiser:</strong> {mockEvent.organiser}</p>
        </div>

        <div className="tickets-section">
          <h2>Booked Tickets</h2>
          {mockTickets.map((ticket) => (
            <TicketBar key={ticket.ticketID} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;