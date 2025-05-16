import { Link } from 'react-router-dom';
import './CreateEventButton.css';


const CreateEventButton = () => {
  return (
    <Link to="/create" className="event-button-link">
      <button className="event-button">Create Event</button>
    </Link>
  );
};

export default CreateEventButton;