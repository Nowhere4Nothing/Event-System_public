const db = require('./database');

db.serialize(() => {
  db.run(`INSERT INTO Venue (venueID, venueName, capacity) VALUES ('V001', 'Sydney Conference Hall', 300)`);
  db.run(`INSERT INTO User (username, password, userType, email, address, phone) 
          VALUES ('organiser1', 'pass123', 'organiser', 'org1@example.com', '123 Main St', '123456789')`);
  db.run(`INSERT INTO Organiser (username, organisationName) VALUES ('organiser1', 'Tech Events Ltd')`);

  db.run(`INSERT INTO Event (
    eventID, eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID
  ) VALUES (
    'E001', 'Tech Expo', 'Expo', '2025-06-10', 'V001', 'A cool tech event.', '10:00', 'Keynote Speaker', null, 'organiser1'
  )`);

  console.log('✅ Sample data inserted.');
});
