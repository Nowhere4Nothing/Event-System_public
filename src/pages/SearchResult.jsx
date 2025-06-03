import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResult.css'

function SearchResults() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filteredEvents, setFilteredEvents] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    // Extract search query from URL ?q=searchTerm
    const params = new URLSearchParams(location.search);
    const query = params.get('q')?.toLowerCase() || '';

    // Fetch all events from backend on mount
    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('http://localhost:5000/events', { credentials: 'include' });
                const data = await res.json();
                const formattedEvents = data.map(event => ({
                    // everyhting you can search for, making it a new object once fetched from the database
                    id: event.eventID,
                    name: event.eventName,
                    genre: event.eventType,
                    day: event.eventDate,
                    performer: event.performer,
                    venue: event.venueName || 'Unknown',
                }));
                setEvents(formattedEvents);
                setLoading(false);
            } catch (err) {
                // displaying error
                console.error('Error fetching events:', err);
                setError(true);
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    // Filter events based on query whenever events or query changes
    useEffect(() => {
        if (!query) {
            setFilteredEvents([]);
            setError(false);
            return;
        }

        // getting the search
        const matched = events.filter(event =>
            String(event.id) === query ||
            event?.name.toLowerCase().includes(query) ||
            event?.genre.toLowerCase().includes(query) ||
            event?.day.toLowerCase().includes(query) ||
            (event?.performer && event.performer.toLowerCase().includes(query)) ||
            (event?.venue && event.venue.toLowerCase().includes(query))
        );

        // getting the matches in an array
        if (matched.length > 0) {
            setFilteredEvents(matched);
            setError(false);
        } else {
            // displaying nothing and setting an error
            setFilteredEvents([]);
            setError(true);
        }
    }, [query, events]);

    return (
        <div className="search-results-page">
            <h2>Search Results</h2>
            {error && <p className="error-message">Event not found. Please try again.</p>}
            {filteredEvents.length > 0 ? (
                <ul className="search-results-list">
                    {filteredEvents.map(event => (
                        <li
                            key={event.id}
                            onClick={() => navigate(`/events/${event.id}`)}
                        >
                            {event.name} – {event.genre} – {event.venue} – {event.day}
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>No results found.</p>
            )}
        </div>
    );
}

export default SearchResults;
