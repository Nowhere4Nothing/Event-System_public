const express = require('express');
const cors = require('cors');
const db = require('./database'); // Your SQLite3 connection
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/venues', (req, res) => {
  const query = `
    SELECT
      Venue.venueID,
      Venue.venueName,
      Venue.capacity
    FROM Venue
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching venues:', err.message);
      return res.status(500).json({ error: 'Failed to fetch venues' });
    }
    res.json(rows);
  });
});

// Get all events with venue names
app.get('/events', (req, res) => {
  const query = `
    SELECT 
      Event.eventID,
      Event.eventName,
      Event.eventType,
      Event.eventDate,
      Event.venueID,
      Venue.venueName,
      Event.eventDesc,
      Event.eventTime,
      Event.performer,
      Event.banner,
      Event.organiserID
    FROM Event
    LEFT JOIN Venue ON Event.venueID = Venue.venueID
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching events:', err.message);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
    res.json(rows);
  });
});

// Get single event by ID (for EventDetails.jsx)
app.get('/events/:id', (req, res) => {
  const eventId = req.params.id;

  const query = `
    SELECT 
      Event.eventID,
      Event.eventName,
      Event.eventType,
      Event.eventDate,
      Event.venueID,
      Venue.venueName,
      Event.eventDesc,
      Event.eventTime,
      Event.performer,
      Event.banner,
      Event.organiserID
    FROM Event
    LEFT JOIN Venue ON Event.venueID = Venue.venueID
    WHERE Event.eventID = ?
  `;

  db.get(query, [eventId], (err, row) => {
    if (err) {
      console.error('Error fetching event by ID:', err.message);
      return res.status(500).json({ error: 'Failed to fetch event' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(row);
  });
});

// Create a new event
app.post('/events', (req, res) => {
  const {
    eventName,
    eventType,
    eventDate,
    venueID,
    eventDesc,
    eventTime,
    performer,
    banner,
    organiserID
  } = req.body;

  const query = `
    INSERT INTO Event (
      eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID],
    function (err) {
      if (err) {
        console.error('Error creating event:', err.message);
        return res.status(500).json({ error: 'Failed to create event' });
      }
      res.status(201).json({ eventID: this.lastID });
    }
  );
});

// Update specific event
app.put('/events/:id', (req, res) => {
  const eventId = req.params.id;
  const {
    eventName,
    eventType,
    eventDate,
    venueID,
    eventDesc,
    eventTime,
    performer,
    banner,
    organiserID
  } = req.body;

  const query = `
    UPDATE Event SET
      eventName = ?,
      eventType = ?,
      eventDate = ?,
      venueID = ?,
      eventDesc = ?,
      eventTime = ?,
      performer = ?,
      banner = ?,
      organiserID = ?
    WHERE eventID = ?
  `;

  db.run(
    query,
    [eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID, eventId],
    function (err) {
      if (err) {
        console.error('Error updating event:', err.message);
        return res.status(500).json({ error: 'Failed to update event' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event updated successfully' });
    }
  );
});

app.get('/ticketOptions', (req, res) => {
  const query = `
    SELECT 
      TicketOption.ticketOptionID,
      TicketOption.eventID,
      TicketOption.ticketType,
      TicketOption.price,
      TicketOption.quantity
    FROM TicketOption
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching ticket options:', err.message);
      return res.status(500).json({ error: 'Failed to fetch ticket options' });
    }
    res.json(rows);
  });
});

app.get('/ticketOptions/:eventID', (req, res) => {
  const eventId = req.params.eventID;

  const query = `
    SELECT 
      TicketOption.ticketOptionID,
      TicketOption.eventID,
      TicketOption.ticketType,
      TicketOption.price,
      TicketOption.quantity
    FROM TicketOption
    WHERE eventID = ?
  `;

  db.all(query, [eventId], (err, rows) => {
    if (err) {
      console.error('Error fetching ticket options for event:', err.message);
      return res.status(500).json({ error: 'Failed to fetch ticket options' });
    }
    res.json(rows);
  });
});

app.post('/ticketOptions', (req, res) => {
  const { eventID, ticketType, price, quantity } = req.body;

  const query = `
    INSERT INTO TicketOption (eventID, ticketType, price, quantity)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    query,
    [eventID, ticketType, price, quantity],
    function (err) {
      if (err) {
        console.error('Error creating ticket option:', err.message);
        return res.status(500).json({ error: 'Failed to create ticket option' });
      }
      res.status(201).json({ ticketOptionID: this.lastID });
    }
  );
});

app.put('/ticketOptions/:id', (req, res) => {
  const ticketOptionId = req.params.id;
  const { eventID, ticketType, price, quantity } = req.body;

  const query = `
    UPDATE TicketOption SET
      eventID = ?,
      ticketType = ?,
      price = ?,
      quantity = ?
    WHERE ticketOptionID = ?
  `;

  db.run(
    query,
    [eventID, ticketType, price, quantity, ticketOptionId],
    function (err) {
      if (err) {
        console.error('Error updating ticket option:', err.message);
        return res.status(500).json({ error: 'Failed to update ticket option' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Ticket option not found' });
      }
      res.json({ message: 'Ticket option updated successfully' });
    }
  );
});

app.get('/users', (req, res) => {
  const query = `
    SELECT 
      User.username,
      User.password,
      User.userType,
      User.email,
      User.address,
      User.phone
    FROM User
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(rows);
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
