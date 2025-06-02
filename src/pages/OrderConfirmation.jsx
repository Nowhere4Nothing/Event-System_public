import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

        console.log('Fetched data:', data);

        if (!Array.isArray(data.order)) {
          throw new Error('Expected an array of tickets from the backend');
        }

        setTickets(data.order);
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
        <h1>Order Confirmation</h1>
        <p>Your payment ID: <strong>{paymentID}</strong></p>
        <ul className="ticket-list">
        {tickets.map(ticket => (
            <li key={ticket.ticketID} className="ticket-item">
            <strong>{ticket.eventName}</strong> — {ticket.ticketType} <br />
            Date: {ticket.eventDate} at {ticket.eventTime} <br />
            Venue: {ticket.venueName}
            </li>
        ))}
        </ul>
    </div>
    );

}

export default OrderConfirmation;
