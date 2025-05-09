import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import './FeaturedEvents.css';

function FeaturedEvents() {
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
  );
}

export default FeaturedEvents;
