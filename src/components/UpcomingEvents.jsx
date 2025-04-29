import React from 'react';
import './UpcomingEvents.css';

const events = [
  {
    id: 1,
    title: 'Tech Conference 2025',
    date: '2025-06-10',
    location: 'Sydney',
    price: '$99',
  },
  {
    id: 2,
    title: 'Startup Pitch Night',
    date: '2025-07-03',
    location: 'Melbourne',
    price: 'Free',
  },
  {
    id: 3,
    title: 'Wine & Art Expo',
    date: '2025-08-15',
    location: 'Brisbane',
    price: '$49',
  },
];

function UpcomingEvents() {
  return (
    <div className="upcoming-events-container">
      {events.map((event) => (
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

export default UpcomingEvents;
