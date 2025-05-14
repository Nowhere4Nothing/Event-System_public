import React, { useEffect, useState } from 'react';
import Categories from '../components/Categories';
import UpcomingEvents from '../components/UpcomingEvents';
import FeaturedEvents from '../components/FeaturedEvents';
import CreateAccountButton from '../components/CreateEventButton';
import './Home.css';

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

      <section className="events-section">
        <h2 className="section-heading">Upcoming Events</h2>
        <div className="events-grid">
          <UpcomingEvents />
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-heading">Featured Events</h2>
        <div className="events-grid">
          <FeaturedEvents />
        </div>
      </section>
      <CreateAccountButton />
    </div>
  );
}

export default Home;
