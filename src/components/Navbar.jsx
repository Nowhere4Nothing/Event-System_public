import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">Eventual</div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for events..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <button className="account-button" onClick={() => navigate('/login')}>Account</button>
    </nav>
  );
}

export default Navbar;
