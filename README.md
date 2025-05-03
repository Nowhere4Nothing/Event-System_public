Hello all, i'll write this so you guys know how to use the backend and frontend servers together. 

To launch the app you need to first setup the backend server and then run the frontend. Steps are as follows:
1. In a terminal linked to the /Event-System/ folder, write:
```
cd server
node index.js
```
You should then see this:
```
Server running on http://localhost:5000
```

2. In another terminal linked to the main folder, write:
```
npm start
```
This should then launch the app in a web browser.

**IMPORTANT:** these _NEED_ to be in seperate terminals or this won't work.

To check if the database is working, it should pull events for the 'Featured Events' section and the 'Upcoming Events' section. 


### Background info you might want:
- This app is seperated into two servers, both the frontend (running on port 3000) and the backend (running on port 5000). 
- The database file itself can be found in server/eventDB.sqlite3, this contains all of the data entries of events, venues, etc.
- The database can be checked by opening a terminal linked to the main folder and writing:
```
cd server
sqlite3 eventDB.sqlite
```
It should then open the sqlite CLI:
```
sqlite3> SELECT * FROM Event;
```
This is an example select statement to select all of the events from the database. 

**BEFORE YOU ACCESS TO DATABASE YOU NEED TO DOWNLOAD THE SQLITE3 TOOLS FROM THE RAR FILE IN THE DISCORD**






