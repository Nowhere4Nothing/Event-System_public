function EventCard({ title, date, location, price }) {
    return (
      <div className="event-card">
        <h3>{title}</h3>
        <p>{date} | {location}</p>
        <p>{price}</p>
        <button className="register-btn">Register</button>
      </div>
    );
  }
  
  export default EventCard;
  