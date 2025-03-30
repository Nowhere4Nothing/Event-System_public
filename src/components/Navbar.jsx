import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/organizer">Organizer</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
