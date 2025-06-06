import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Categories from '../components/Categories';
import UpcomingEvents from '../components/UpcomingEvents';
import FeaturedEvents from '../components/FeaturedEvents';
import RefineSearch from '../components/RefineSearch';
import './Home.css';

function Home() {
  const [dbEvents, setDbEvents] = useState([]);
  const [loadingDbEvents, setLoadingDbEvents] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  //controlled filter states from url or defaults
  const categoryFromUrl = searchParams.get('category') || 'All';
  const searchTermFromUrl = searchParams.get('search') || '';
  const venueFromUrl = searchParams.get('venue') || '';
  const minPriceFromUrl = searchParams.get('minPrice') || '';
  const maxPriceFromUrl = searchParams.get('maxPrice') || '';
  const startDateFromUrl = searchParams.get('startDate') || '';
  const endDateFromUrl = searchParams.get('endDate') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchTerm, setSearchTerm] = useState(searchTermFromUrl);
  const [selectedVenue, setSelectedVenue] = useState(venueFromUrl);
  const [minPrice, setMinPrice] = useState(minPriceFromUrl);
  const [maxPrice, setMaxPrice] = useState(maxPriceFromUrl);
  const [startDate, setStartDate] = useState(startDateFromUrl);
  const [endDate, setEndDate] = useState(endDateFromUrl);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [refineOpen, setRefineOpen] = useState(false);

  //fetch events from backend
  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then(res => res.json())
      .then(data => {
        setDbEvents(data);
        setLoadingDbEvents(false);
      })
      .catch(err => {
        console.error('Error fetching events from DB:', err.message || err);
        setLoadingDbEvents(false);
      });
  }, []);

  //extract unique venue names for filtering dropdown
  useEffect(() => {
    const venues = [...new Set(dbEvents.map(event => event.venueName))];
    setAvailableVenues(venues);
  }, [dbEvents]);

  //reset filters except category when category changes to something other than 'All'
  useEffect(() => {
    if (selectedCategory !== 'All') {
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
      setSelectedVenue('');
      setMinPrice('');
      setMaxPrice('');
    }
  }, [selectedCategory]);

  //update url params when filters change and reset category to 'All'
  useEffect(() => {
    const params = {};

    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    if (selectedVenue) params.venue = selectedVenue;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    setSearchParams(params);

    if (selectedCategory !== 'All') {
      setSelectedCategory('All');
    }
  }, [searchTerm, selectedVenue, minPrice, maxPrice, startDate, endDate]);

  //filtering logic
  const filteredEvents = dbEvents.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.eventType === selectedCategory;
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

    return matchesCategory && matchesSearch && afterStart && beforeEnd && matchesVenue && aboveMin && belowMax;
  });

  //detect if any filters other than category are active
  const isFilteringActive =
    (searchTerm.trim() !== '' ||
      startDate !== '' ||
      endDate !== '' ||
      selectedVenue !== '' ||
      minPrice !== '' ||
      maxPrice !== '') &&
    selectedCategory === 'All';

  const filters = {
    searchTerm,
    selectedVenue,
    minPrice,
    maxPrice,
    startDate,
    endDate,
  };

  function handleChangeFilters(updatedFilters) {
    if ('searchTerm' in updatedFilters) setSearchTerm(updatedFilters.searchTerm);
    if ('selectedVenue' in updatedFilters) setSelectedVenue(updatedFilters.selectedVenue);
    if ('minPrice' in updatedFilters) setMinPrice(updatedFilters.minPrice);
    if ('maxPrice' in updatedFilters) setMaxPrice(updatedFilters.maxPrice);
    if ('startDate' in updatedFilters) setStartDate(updatedFilters.startDate);
    if ('endDate' in updatedFilters) setEndDate(updatedFilters.endDate);
  }

  return (
    <div className="home-page" data-testid="home-page">
      <Categories
        onSelect={category => {
          setSelectedCategory(category);
          setSearchTerm('');
          setStartDate('');
          setEndDate('');
          setSelectedVenue('');
          setMinPrice('');
          setMaxPrice('');
          setSearchParams({ category });
        }}
        data-testid="categories"
        selectedCategory={selectedCategory}
      />

      <RefineSearch
        filters={filters}
        setRefineOpen={setRefineOpen}
        refineOpen={refineOpen}
        onChangeFilters={handleChangeFilters}
        availableVenues={availableVenues}
      />

      {isFilteringActive ? (
        <section className="events-section" data-testid="filtered-section">
          <h2 className="section-heading">Filtered Results</h2>
          <div className="events-grid" data-testid="featured-grid">
            <FeaturedEvents events={filteredEvents} />
          </div>
        </section>
      ) : (
        <>
          <section className="events-section" data-testid="upcoming-section">
            <h2 className="section-heading">Upcoming Events</h2>
            <div className="events-grid" data-testid="upcoming-grid">
              <UpcomingEvents events={dbEvents} />
            </div>
          </section>

          <section className="events-section" data-testid="featured-section">
            <h2 className="section-heading">Featured Events</h2>
            <div className="events-grid" data-testid="featured-grid">
              <FeaturedEvents events={dbEvents} />
            </div>
          </section>
        </>
      )}
    </div>
  );


}

export default Home;
