import React, { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import UpcomingEvents from '../components/UpcomingEvents';
import FeaturedEvents from '../components/FeaturedEvents';
import './Home.css';
import EventCard from '../components/EventCard';

function Home() {
  const [dbEvents, setDbEvents] = useState([]);
  const [loadingDbEvents, setLoadingDbEvents] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched DB events:', data);
        setDbEvents(data);
        setLoadingDbEvents(false);
      })
      .catch(err => {
        console.error('Error fetching events from DB:', err);
        setLoadingDbEvents(false);
      });
  }, []);

  return (
    <div className="home-page">
      <Categories />
      <UpcomingEvents />
      <FeaturedEvents />

      <section className="events-section">
        <h2 className="section-heading">Upcoming Events</h2>
        <div className="events-grid">
          {loadingDbEvents ? (
            <p>Loading events from DB...</p>
          ) : dbEvents.length === 0 ? (
            <p>No events found in DB.</p>
          ) : (
            dbEvents.slice(0, 3).map(event => (
              <EventCard key={event.eventID} event={event} />
            ))
          )}
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-heading">Featured Events</h2>
        <div className="events-grid">
          {loadingDbEvents ? (
            <p>Loading events from DB...</p>
          ) : dbEvents.length === 0 ? (
            <p>No events found in DB.</p>
          ) : (
            dbEvents.slice(3).map(event => (
              <EventCard key={event.eventID} event={event} />
            ))
          )}
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-heading">Test DB Events</h2>
        {loadingDbEvents ? (
          <p>Loading events from DB...</p>
        ) : dbEvents.length === 0 ? (
          <p>No events found in DB.</p>
        ) : (
          <ul>
            {dbEvents.map(event => (
              <li key={event.eventID}>
                {event.eventName} on {event.eventDate} at {event.venueID}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
