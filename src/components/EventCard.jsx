import { Link } from 'react-router-dom';


function EventCard({ title, date, location, price, id }) {
    return (
      <Link to={`/events/${id}`} className="event-card-link">
        <div className="event-card">
          <h3>{title}</h3>
          <p>{date} | {location}</p>
          <p>{price}</p>
          <button className="register-btn">Register</button>
        </div>
      </Link>
    );
  }
  
  export default EventCard;
  