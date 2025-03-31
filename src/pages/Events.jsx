import EventCard from '../components/EventCard';
import '../assets/styles/main.css';

function Events() {
  // Dummy event data — later fetched from backend
  const events = [
    { id: '1', title: 'Tech Conference 2025', date: '2025-06-10', location: 'Sydney', price: '$99' },
    { id: '2', title: 'Startup Pitch Night', date: '2025-07-03', location: 'Melbourne', price: 'Free' },
    { id: '3', title: 'Wine & Art Expo', date: '2025-08-15', location: 'Brisbane', price: '$49' },
    { id: '4', title: 'React Dev Summit', date: '2025-09-01', location: 'Online', price: '$25' },
    { id: '5', title: 'Hackathon AU', date: '2025-10-12', location: 'Canberra', price: 'Free' },
    { id: '6', title: 'Ecom Growth Panel', date: '2025-11-22', location: 'Sydney', price: '$75' },
  ];
  

  return (
    <div className="events-page">
      <h2>All Events</h2>

      {/* Optional Filter/Search UI */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search events by name, city, or type..."
          className="search-input"
        />
      </div>

      {/* Grid of Event Cards */}
      <div className="event-grid">
        {events.map((event) => (
          <EventCard
          key={event.id}
          id={event.id} // 👈 this line is essential
          title={event.title}
          date={event.date}
          location={event.location}
          price={event.price}
        />
        
        ))}
      </div>
    </div>
  );
}

export default Events;
