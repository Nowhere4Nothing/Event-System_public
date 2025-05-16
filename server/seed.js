const db = require('./database');

db.serialize(() => {
  // Insert venues
  db.run(`INSERT INTO Venue (venueID, venueName, capacity) VALUES 
    ('V001', 'Sydney Conference Hall', 300),
    ('V002', 'Melbourne Startup Hub', 200),
    ('V003', 'Brisbane Arts Center', 150),
    ('V004', 'Online Platform', 1000),
    ('V005', 'Sydney Tech Arena', 500),
    ('V006', 'Melbourne Blockchain Venue', 250)`);

  // Insert organiser
  db.run(`INSERT INTO User (username, password, userType, email, address, phone) 
          VALUES ('organiser1', 'pass123', 'organiser', 'org1@example.com', '123 Main St', '123456789')`);
  db.run(`INSERT INTO Organiser (username, organisationName) 
          VALUES ('organiser1', 'Tech Events Ltd')`);

  // Insert events
  db.run(`INSERT INTO Event (
    eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID
  ) VALUES 
    ('Tech Conference 2025', 'Conference', '2025-06-10', 'V001', 'Annual tech conference.', '09:00', '', null, 'organiser1'),
    ('Startup Pitch Night', 'Networking', '2025-07-03', 'V002', 'Startup networking event.', '18:00', '', null, 'organiser1'),
    ('Wine & Art Expo', 'Expo', '2025-08-15', 'V003', 'Art and wine exhibition.', '11:00', '', null, 'organiser1'),
    ('React Developers Meetup', 'Meetup', '2025-09-05', 'V004', 'React devs online meetup.', '17:00', '', null, 'organiser1'),
    ('AI & Machine Learning Expo', 'Expo', '2025-10-15', 'V005', 'AI and ML innovations.', '10:00', '', null, 'organiser1'),
    ('Blockchain Summit 2025', 'Summit', '2025-11-20', 'V006', 'Summit for blockchain tech.', '09:30', '', null, 'organiser1')`);

  console.log('✅ Events inserted successfully.');
});
