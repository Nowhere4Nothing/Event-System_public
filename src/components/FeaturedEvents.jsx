import React from 'react';
import './FeaturedEvents.css';

const featuredEvents = [
  {
    id: 1,
    title: 'React Developers Meetup',
    date: '2025-09-05',
    location: 'Online',
    price: 'Free',
  },
  {
    id: 2,
    title: 'AI & Machine Learning Expo',
    date: '2025-10-15',
    location: 'Sydney',
    price: '$120',
  },
  {
    id: 3,
    title: 'Blockchain Summit 2025',
    date: '2025-11-20',
    location: 'Melbourne',
    price: '$80',
  },
];

function FeaturedEvents() {
  return (
    <div className="featured-events-container">
      {featuredEvents.map((event) => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.date}</p>
          <p>{event.location}</p>
          <p>{event.price}</p>
        </div>
      ))}
    </div>
  );
}

export default FeaturedEvents;
