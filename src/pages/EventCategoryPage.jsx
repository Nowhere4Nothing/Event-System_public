import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import RefineSearch from '../components/RefineSearch';
import './EventCategoryPage.css';

function EventCategoryPage() {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [refineOpen, setRefineOpen] = useState(false);

  //filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filters = {
    searchTerm,
    selectedVenue,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  };

  function handleChangeFilters(updated) {
    if ('searchTerm' in updated) setSearchTerm(updated.searchTerm);
    if ('selectedVenue' in updated) setSelectedVenue(updated.selectedVenue);
    if ('minPrice' in updated) setMinPrice(updated.minPrice);
    if ('maxPrice' in updated) setMaxPrice(updated.maxPrice);
    if ('startDate' in updated) setStartDate(updated.startDate);
    if ('endDate' in updated) setEndDate(updated.endDate);
  }

  useEffect(() => {
    fetch('/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setAvailableVenues([...new Set(data.map(e => e.venueName))]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading events...</p>;

  //normalize category name
  const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  //filter events by category first
  let filteredEvents = normalizedCategory === 'All'
    ? events
    : events.filter(event => event.eventType === normalizedCategory);

  //apply additional filters
  filteredEvents = filteredEvents.filter(event => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.performer?.toLowerCase().includes(searchTerm.toLowerCase());

    const eventDate = new Date(event.eventDate);
    const afterStart = !startDate || eventDate >= new Date(startDate);
    const beforeEnd = !endDate || eventDate <= new Date(endDate);

    const matchesVenue = !selectedVenue || event.venueName === selectedVenue;

    const eventPriceLow = event.minPrice ?? 0;
    const eventPriceHigh = event.maxPrice ?? 0;
    const aboveMin = !minPrice || eventPriceHigh >= parseFloat(minPrice);
    const belowMax = !maxPrice || eventPriceLow <= parseFloat(maxPrice);

    return matchesSearch && afterStart && beforeEnd && matchesVenue && aboveMin && belowMax;
  });

  return (
    <div className="event-category-page">
      <div className="title-with-arrow">
        <a href="/" className="back-arrow">&#8592;  </a>
        <h1>{normalizedCategory}</h1>
      </div>

      <RefineSearch
        filters={filters}
        setRefineOpen={setRefineOpen}
        refineOpen={refineOpen}
        onChangeFilters={handleChangeFilters}
        availableVenues={availableVenues}
      />

      {filteredEvents.length === 0 ? (
        <p>No events found in category: {normalizedCategory}</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.eventID} event={event} />
          ))}
        </div>
      )}
    </div>
  );

}

export default EventCategoryPage;
