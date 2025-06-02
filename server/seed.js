const db = require('./database');

db.prepare('DELETE FROM EventTransaction').run();
db.prepare('DELETE FROM Ticket').run();
db.prepare('DELETE FROM TicketOption').run();
db.prepare('DELETE FROM Event').run();
db.prepare('DELETE FROM sqlite_sequence').run();
db.prepare('DELETE FROM Organiser').run();
db.prepare('DELETE FROM Venue').run();
db.prepare('DELETE FROM User').run();

// Insert venues
db.prepare(`
  INSERT INTO Venue (venueID, venueName, capacity) VALUES 
    ('V001', 'Sydney Conference Hall', 300),
    ('V002', 'Melbourne Startup Hub', 200),
    ('V003', 'Brisbane Arts Center', 150),
    ('V004', 'Online Platform', 1000),
    ('V005', 'Sydney Tech Arena', 500),
    ('V006', 'Melbourne Blockchain Venue', 250)
`).run();

// Insert organiser user
db.prepare(`
  INSERT INTO User (username, password, userType, email, address, phone) 
  VALUES 
    ('organiser1', 'pass123', 'Organiser', 'org1@example.com', '123 Main St', '123456789'),
    ('user1', 'pass123', 'Guest', 'guest1@example.com', '456 Elm St', '987654321')
`).run();

db.prepare(`
  INSERT INTO Organiser (username, organisationName) 
  VALUES ('organiser1', 'Tech Events Ltd')
`).run();

// Insert events
db.prepare(`
  INSERT INTO Event (
    eventName, eventType, eventDate, venueID, eventDesc, eventTime, performer, banner, organiserID
  ) VALUES 
    ('Tech Conference 2025', 'Conference', '2025-06-10', 'V001', 'Annual tech conference.', '09:00', '', null, 'organiser1'),
    ('Startup Pitch Night', 'Networking', '2025-07-03', 'V002', 'Startup networking event.', '18:00', '', null, 'organiser1'),
    ('Wine & Art Expo', 'Expo', '2025-08-15', 'V003', 'Art and wine exhibition.', '11:00', '', null, 'organiser1'),
    ('React Developers Meetup', 'Meetup', '2025-09-05', 'V004', 'React devs online meetup.', '17:00', '', null, 'organiser1'),
    ('AI & Machine Learning Expo', 'Expo', '2025-10-15', 'V005', 'AI and ML innovations.', '10:00', '', null, 'organiser1'),
    ('Blockchain Summit 2025', 'Summit', '2025-11-20', 'V006', 'Summit for blockchain tech.', '09:30', '', null, 'organiser1')
`).run();

// Tech Conference 2025 (eventID = 1)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(1, 'General Admission', 50.00, 200);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(1, 'Student Pass', 25.00, 100);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(1, 'VIP Access', 120.00, 30);

// Startup Pitch Night (eventID = 2)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(2, 'Standard Entry', 20.00, 150);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(2, 'Networking Lounge', 40.00, 50);

// Wine & Art Expo (eventID = 3)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(3, 'Day Pass', 30.00, 200);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(3, 'Weekend Pass', 60.00, 100);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(3, 'VIP Wine Tasting', 100.00, 20);

// React Developers Meetup (eventID = 4)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(4, 'RSVP Ticket', 0.00, 300);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(4, 'Supporter Ticket', 15.00, 50);

// AI & Machine Learning Expo (eventID = 5)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(5, 'Expo Entry', 45.00, 250);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(5, 'Workshop Pass', 90.00, 60);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(5, 'VIP + Workshop', 150.00, 25);

// Blockchain Summit 2025 (eventID = 6)
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(6, 'Standard Pass', 70.00, 180);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(6, 'Developer Pass', 90.00, 100);
db.prepare(`INSERT INTO TicketOption (eventID, ticketType, price, quantity) VALUES (?, ?, ?, ?)`).run(6, 'Investor VIP', 200.00, 20);


console.log('Database seeded successfully.');
