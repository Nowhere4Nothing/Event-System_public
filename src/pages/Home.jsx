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
    <div className="home-page" data-testid="home-page">
      <Categories data-testid="categories" />

      <section className="events-section" data-testid="upcoming-section">
        <h2 className="section-heading">
            Upcoming Events
        </h2>
        <div className="events-grid" data-testid="upcoming-grid">
          <UpcomingEvents data-testid="upcoming-events" />
        </div>
      </section>

      <section className="events-section" data-testid="featured-section">
        <h2 className="section-heading">
            Featured Events
        </h2>
        <div className="events-grid" data-testid="featured-grid">
          <FeaturedEvents  data-testid="featured-events" />
        </div>
      </section>
      <CreateAccountButton data-cy="create-account-button" />
    </div>
  );
}

export default Home;
