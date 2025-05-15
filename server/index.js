const express = require('express');
const cors = require('cors');
const db = require('./database'); // Your SQLite3 connection
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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
