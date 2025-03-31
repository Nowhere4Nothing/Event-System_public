import EventCard from './EventCard';

function FeaturedEvents() {
  // Mock data (you can fetch later from backend)
  const events = [
    { id: 1, title: 'Tech Conference 2025', date: '2025-06-10', location: 'Sydney', price: '$99' },
    { id: 2, title: 'Startup Pitch Night', date: '2025-07-03', location: 'Melbourne', price: 'Free' },
    { id: 3, title: 'Art & Wine Festival', date: '2025-08-15', location: 'Brisbane', price: '$49' },
  ];

  return (
    <section className="featured-events">
      <h2>Featured Events</h2>
      <div className="event-grid">
        {events.map(event => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            price={event.price}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedEvents;
