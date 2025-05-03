// server.js or routes/events.js
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./database');

app.use(cors()); // Enable CORS
app.use(express.json());

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
      console.error('Error fetching events with venue names:', err.message);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
    res.json(rows);
  });
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
