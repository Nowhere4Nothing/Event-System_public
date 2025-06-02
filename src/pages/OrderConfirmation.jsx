import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import './OrderConfirmation.css';
import logo from '../assets/images/logo.png';


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

  function handleViewTicket(ticket) {
    const doc = new jsPDF();

    const img = new Image();
    img.src = logo;

    img.onload = () => {
        const pxToMm = (px) => px * 0.264583;
        const imgWidth = pxToMm(img.naturalWidth);
        const imgHeight = pxToMm(img.naturalHeight);

        //logo
        doc.addImage(img, 'PNG', 20, 10, imgWidth / 2, imgHeight / 2);

        let y = 10 + imgHeight / 2 + 10;

        //text
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Ticket Confirmation', 20, y);
        y += 15;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(12);

        //format each line
        function writeLabelValue(label, value, x, y) {
            doc.setFont(undefined, 'bold');
            doc.text(`${label}: `, x, y);
            const labelWidth = doc.getTextWidth(`${label}: `);
            doc.setFont(undefined, 'normal');
            doc.text(value, x + labelWidth, y);
        }

        //write lines
        const x = 20;
        writeLabelValue('Event', ticket.eventName, x, y); y += 10;
        writeLabelValue('Type', ticket.ticketType, x, y); y += 10;
        writeLabelValue('Date', ticket.eventDate, x, y); y += 10;
        writeLabelValue('Time', ticket.eventTime, x, y); y += 10;
        writeLabelValue('Venue', ticket.venueName, x, y); y += 10;
        writeLabelValue('Payment ID', ticket.paymentID, x, y); y += 10;
        doc.setFont(undefined, 'bold');
        doc.text(`Barcode: `, x, y += 10);

        //generate barcode
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, ticket.ticketID, {
        format: 'CODE128',
        width: 2,
        height: 50,
        displayValue: false,
        });

        const barcodeDataUrl = canvas.toDataURL('image/png');
        const barcodeWidth = 150;
        const barcodeX = (doc.internal.pageSize.getWidth() - barcodeWidth) / 2;

        doc.addImage(barcodeDataUrl, 'PNG', barcodeX, y, barcodeWidth, 50);

        //add ticket ID under barcode
        y += 55;
        doc.setFontSize(8);
        doc.text('Ticket ID: ' + ticket.ticketID, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });

        //open PDF in new tab
        const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
    };
    }



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
            <button
              className="view-ticket-button"
              onClick={() => handleViewTicket(ticket)}
            >
              View Ticket
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderConfirmation;
