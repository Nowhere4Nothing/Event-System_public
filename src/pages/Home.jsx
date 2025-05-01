import React from 'react';
import Categories from '../components/Categories';
import UpcomingEvents from '../components/UpcomingEvents';
import FeaturedEvents from '../components/FeaturedEvents';
import './Home.css';
import EventCard from '../components/EventCard';


function Home() {

    const allEvents = [
        { id: 1, title: 'Tech Conference 2025', date: '2025-06-10', location: 'Sydney', price: '$99' },
        { id: 2, title: 'Startup Pitch Night', date: '2025-07-03', location: 'Melbourne', price: 'Free' },
        { id: 3, title: 'Wine & Art Expo', date: '2025-08-15', location: 'Brisbane', price: '$49' },
        { id: 4, title: 'React Developers Meetup', date: '2025-09-05', location: 'Online', price: 'Free' },
        { id: 5, title: 'AI & Machine Learning Expo', date: '2025-10-15', location: 'Sydney', price: '$120' },
        { id: 6, title: 'Blockchain Summit 2025', date: '2025-11-20', location: 'Melbourne', price: '$80' },
      ];
      

  return (
    <div className="home-page">
      <Categories />

{/*      <section className="events-section">*/}
{/*  <h2 className="section-heading">Upcoming Events</h2>*/}
{/*  <div className="events-grid">*/}
{/*    {allEvents.slice(0, 3).map(event => (*/}
{/*      <EventCard key={event.id} {...event} />*/}
{/*    ))}*/}
{/*  </div>*/}
{/*</section>*/}

{/*<section className="events-section">*/}
{/*  <h2 className="section-heading">Featured Events</h2>*/}
{/*  <div className="events-grid">*/}
{/*    {allEvents.slice(3).map(event => (*/}
{/*      <EventCard key={event.id} {...event} />*/}
{/*    ))}*/}
{/*  </div>*/}
{/*</section>*/}

    </div>
  );
}

export default Home;
