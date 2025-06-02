const express = require('express');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/', (req, res) => {
  const { username, eventID, tickets } = req.body;

  if (!username || !eventID || !tickets || !Array.isArray(tickets)) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    const paymentID = uuidv4();

    const insertTicket = db.prepare(`
      INSERT INTO Ticket (ticketID, eventID, username, ticketType)
      VALUES (?, ?, ?, ?)
    `);

    const insertTransaction = db.prepare(`
      INSERT INTO EventTransaction (paymentID, username, ticketID, quantity)
      VALUES (?, ?, ?, ?)
    `);

    const updateQuantity = db.prepare(`
      UPDATE TicketOption
      SET quantity = quantity - ?
      WHERE ticketOptionID = ?
    `);

    const checkQuantity = db.prepare(`
      SELECT quantity, ticketType FROM TicketOption WHERE ticketOptionID = ?
    `);

    const transaction = db.transaction(() => {
      for (const ticket of tickets) {
        const { ticketOptionID, quantity } = ticket;

        //check availability
        const ticketOption = checkQuantity.get(ticketOptionID);
        if (!ticketOption || ticketOption.quantity < quantity) {
          throw new Error(`Not enough tickets available for ticketOptionID ${ticketOptionID}`);
        }

        //insert tickets and transactions
        for (let i = 0; i < quantity; i++) {
          const ticketID = uuidv4();
          insertTicket.run(ticketID, eventID, username, ticketOption.ticketType);
          insertTransaction.run(paymentID, username, ticketID, 1);
        }

        //update ticket quantity
        updateQuantity.run(quantity, ticketOptionID);
      }
    });

    transaction();

    //return the payment ID for redirection
    res.status(200).json({ message: 'Purchase successful', paymentID });

  } catch (err) {
    console.error('Error during ticket purchase:', err.message);
    if (err.message.startsWith('Not enough tickets')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET /purchase/confirmation/:paymentID
router.get('/confirmation/:paymentID', (req, res) => {
  const { paymentID } = req.params;

  try {
    //get ticket and transaction details
    const transactions = db.prepare(`
      SELECT et.paymentID, et.username, et.ticketID, t.ticketType, t.eventID, e.name AS eventName, e.date, e.venueID, v.name AS venueName
      FROM EventTransaction et
      JOIN Ticket t ON et.ticketID = t.ticketID
      JOIN Event e ON t.eventID = e.eventID
      JOIN Venue v ON e.venueID = v.venueID
      WHERE et.paymentID = ?
    `).all(paymentID);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    //structure response
    const { username, eventName, date, venueName } = transactions[0];

    const tickets = transactions.map(t => ({
      ticketID: t.ticketID,
      ticketType: t.ticketType
    }));

    res.status(200).json({
      paymentID,
      username,
      event: {
        name: eventName,
        date,
        venue: venueName
      },
      tickets
    });

  } catch (err) {
    console.error('Error fetching confirmation:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/confirmation/:paymentID', (req, res) => {
  const { paymentID } = req.params;

  try {
    const tickets = db.prepare(`
      SELECT Ticket.ticketID, Ticket.eventID, Ticket.ticketType
      FROM EventTransaction
      JOIN Ticket ON EventTransaction.ticketID = Ticket.ticketID
      WHERE EventTransaction.paymentID = ?
    `).all(paymentID);

    res.json(tickets);
  } catch (err) {
    console.error('Error fetching confirmation:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
