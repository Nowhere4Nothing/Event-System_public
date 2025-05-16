const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./eventDB.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS User (
    username TEXT PRIMARY KEY,
    password TEXT,
    userType TEXT,
    email TEXT,
    address TEXT,
    phone TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Organiser (
    username TEXT PRIMARY KEY,
    organisationName TEXT,
    FOREIGN KEY(username) REFERENCES User(username)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Venue (
    venueID TEXT PRIMARY KEY,
    venueName TEXT,
    capacity INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Event (
    eventID INTEGER PRIMARY KEY AUTOINCREMENT,
    eventName TEXT,
    eventType TEXT,
    eventDate DATE,
    venueID TEXT,
    eventDesc TEXT,
    eventTime TIME,
    performer TEXT,
    banner BLOB,
    organiserID TEXT,
    FOREIGN KEY(venueID) REFERENCES Venue(venueID),
    FOREIGN KEY(organiserID) REFERENCES Organiser(username)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS TicketOption (
    ticketOptionID INTEGER PRIMARY KEY AUTOINCREMENT,
    eventID TEXT,
    ticketType TEXT,
    price REAL,
    quantity INTEGER,
    FOREIGN KEY(eventID) REFERENCES Event(eventID)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Ticket (
    ticketID TEXT PRIMARY KEY,
    eventID TEXT,
    username TEXT,
    ticketType TEXT,
    FOREIGN KEY(eventID) REFERENCES Event(eventID),
    FOREIGN KEY(username) REFERENCES User(username)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS EventTransaction (
    paymentID TEXT PRIMARY KEY,
    username TEXT,
    ticketID TEXT,
    quantity INTEGER,
    FOREIGN KEY(username) REFERENCES User(username),
    FOREIGN KEY(ticketID) REFERENCES Ticket(ticketID)
  )`);
});

module.exports = db;
