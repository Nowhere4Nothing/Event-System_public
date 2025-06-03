import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewTicketButton from '../components/ViewTicketButton';
import './OrderConfirmation.css';


function OrderConfirmation() {
  const { paymentID } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/confirmation/${paymentID}`);
        if (!res.ok) throw new Error('Failed to fetch order details');
        const data = await res.json();
        setTickets(data.order || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [paymentID]);


  if (loading) return <p>Loading your order...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-confirmation-container">
      <h1>Purchase Successful!</h1>
      <p>Your comfirmation ID: <strong>{paymentID}</strong></p>
      <p>Please view your tickets below and take note of your confirmation number.</p>
      <ul className="ticket-list">
        {tickets.map(ticket => (
          <li key={ticket.ticketID} className="ticket-item">
            <div className="ticket-info">
              <strong>{ticket.eventName}</strong> — {ticket.ticketType} <br />
              Date: {ticket.eventDate} at {ticket.eventTime} <br />
              Venue: {ticket.venueName}
            </div>
            <ViewTicketButton ticket={ticket} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderConfirmation;
