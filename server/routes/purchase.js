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

        //check ticket quantity available
        const ticketOption = checkQuantity.get(ticketOptionID);
        if (!ticketOption || ticketOption.quantity < quantity) {
          throw new Error(`Not enough tickets available for ticketOptionID ${ticketOptionID}`);
        }

        //insert tickets and transactions per quantity
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

    res.status(200).json({ message: 'Purchase successful', paymentID });
  } catch (err) {
    console.error('Error during ticket purchase:', err.message);
    if (err.message.startsWith('Not enough tickets')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

/**/