import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/events/')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.log('Error fetching events',err));
    })

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

      <button className="account-button">Account</button>
    </nav>
  );
}

export default Navbar;
