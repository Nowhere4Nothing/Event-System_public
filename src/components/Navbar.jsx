import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/events')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log('Error fetching events',err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (e) => {setSearchTerm(e.target.value);
    };

    const filterEvents = events.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <nav className="navbar">
      <div className="logo">Eventual</div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for events..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="search-button" onClick={handleSearch}>
            Search
        </button>
      </div>

      <button className="account-button" onClick={() => navigate('/login')}>Account</button>

      <button className="account-button">Account</button>

        {/*Display filtered events */}
        <div className = "event-list">
            {filterEvents.map((event) => (
                <div key={event.eventName}></div>
            ))}
        </div>

    </nav>
  );
}

export default Navbar;
