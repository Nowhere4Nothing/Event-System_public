import { useParams } from 'react-router-dom';
import '../assets/styles/main.css';

function EventDetails() {
  const { id } = useParams();

  // Fake data — backend-ready structure
  const events = [
    { id: '1', title: 'Tech Conference 2025', date: '2025-06-10', location: 'Sydney', price: '$99', desc: 'A conference focused on future tech.' },
    { id: '2', title: 'Startup Pitch Night', date: '2025-07-03', location: 'Melbourne', price: 'Free', desc: 'Watch startups pitch live.' },
    { id: '3', title: 'Wine & Art Expo', date: '2025-08-15', location: 'Brisbane', price: '$49', desc: 'An aesthetic experience with local artists and wineries.' },
  ];

  const event = events.find((e) => e.id === id);

  if (!event) return <p style={{ padding: '2rem' }}>Event not found.</p>;

  return (
    <div className="event-detail-page">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> {event.price}</p>
      <p>{event.desc}</p>
      <button className="register-btn">Register Now</button>
    </div>
  );
}

export default EventDetails;
