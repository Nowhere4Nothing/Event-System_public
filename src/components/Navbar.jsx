import { NavLink } from 'react-router-dom';
import '../assets/styles/main.css'; // optional, or just keep using main.css

function Navbar() {
  return (
    <nav className="navbar">
  <div className="logo">Eventual Events</div>
  <ul className="nav-links">
    <li>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
        Home
      </NavLink>
    </li>
    <li>
      <NavLink to="/events" className={({ isActive }) => isActive ? 'active-link' : ''}>
        Events
      </NavLink>
    </li>
    <li>
      <NavLink to="/organizer" className={({ isActive }) => isActive ? 'active-link' : ''}>
        Organizer
      </NavLink>
    </li>
  </ul>
</nav>

  );
}

export default Navbar;
