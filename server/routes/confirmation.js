const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/:paymentID', (req, res) => {
  const { paymentID } = req.params;

  try {
    const transactionDetails = db.prepare(`
      SELECT 
        ET.paymentID,
        ET.username,
        ET.ticketID,
        T.ticketType,
        E.eventName,
        E.eventDate,
        E.eventTime,
        V.venueName
      FROM EventTransaction ET
      JOIN Ticket T ON ET.ticketID = T.ticketID
      JOIN Event E ON T.eventID = E.eventID
      JOIN Venue V ON E.venueID = V.venueID
      WHERE ET.paymentID = ?
    `).all(paymentID);

    if (transactionDetails.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ order: transactionDetails });
  } catch (err) {
    console.error('Error fetching order confirmation:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
