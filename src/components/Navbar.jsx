import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    // store list of events from backend
    const [events, setEvents] = useState([]);
    //store the users search input
    const [searchTerm, setSearchTerm] = useState('');
    // indicate whether data is currently being fetched
    const [loading, setLoading] = useState(true);
    // store error messages during fetching
    const [error, setError] = useState(false);
    // able to use the navigate function
    const navigate = useNavigate();

    // use effect to fetch events from the backend API when the component mounts
    useEffect(() => {
        (async () => {
            try {
                // fetching the date from the database
                const res = await fetch('http://localhost:5000/events');
                const data = await res.json();
                //processing the data
                const formattedEvents = data.map((event, index) => ({
                    // transforming into a new object
                    id: event.eventID,
                    name: event.eventName,
                    genre: event.type,
                    day: event.eventDate
                }));
                    // updating the state
                    setEvents(formattedEvents);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(true);
            } finally {
                // this will run after teh try or catch block stopping the loading indicator
                setLoading(false);

            }
        })();
    }, []);

        const handleSearch = (e) => {
            setSearchTerm(e.target.value);
            setError(false);
            /*
            Triggered when user types in search bar
            updates search team and resets the error message
             */

    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const search = searchTerm.trim().toLowerCase();
        console.log("events:", events);
        const matchedEvent = events.find((event) =>
            event?.id?.toLowerCase() === search ||
            event?.name.toLowerCase() === search ||
            event?.genre.toLowerCase() === search ||
            event?.day.toLowerCase() === search 
        );

        if (matchedEvent) {
            // go to this page if matches
            navigate(`/events/${matchedEvent.id}`);
        } else {
            console.log("matched event = ", matchedEvent);
            setError(true);
        }
    };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="logo" aria-label="Eventual home" onClick={() => navigate('/')}>
          Eventual</div>

        {/*Searching input field*/}
      <form className="search-container" onSubmit={handleSearchSubmit}>
          <label htmlFor="search-input" className="visually-hidden">
              Search for events
          </label>
        <input
          type="text"
          placeholder="Search for events..."
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search for events"
        />

        <button type="submit" className="search-button" onClick={handleSearchSubmit}>
            Search
        </button>
      </form>

          {/*Account button*/}
      <button className="account-button" onClick={() => navigate('/login')}>Account</button>

        {/*Display filtered events */}
        <div className = "event-list">
            {/* Display loading message while fetching data */}
            {loading && <p>Loading events...</p>}

            {/* Display error message if data fetching fails */}
            {error && <p className="error-message">{error}</p>}
        </div>

        {error && (
            <div style={{ color: "red", marginTop: "10px" }}>
                Event not found. Please check the spelling or try another event.
            </div>
        )}

    </nav>
  );

}

export default Navbar;
