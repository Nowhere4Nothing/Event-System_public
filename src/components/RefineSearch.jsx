import React from 'react';
import './RefineSearch.css';

function RefineSearch({ filters, refineOpen, setRefineOpen, onChangeFilters, availableVenues }) {
  const { searchTerm, startDate, endDate, selectedVenue, minPrice, maxPrice } = filters;

  //clear filters
  const clearFilters = () => {
    onChangeFilters({
      searchTerm: '',
      startDate: '',
      endDate: '',
      selectedVenue: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div>
      <div className="refine-toggle">
        <button onClick={() => setRefineOpen(!refineOpen)}>
          {refineOpen ? 'Hide Filters' : 'Filter'}
        </button>
      </div>

      {refineOpen && (
        <div className="refine-panel">
          <input
            type="text"
            placeholder="Search by name or performer"
            value={searchTerm}
            onChange={e => onChangeFilters({ ...filters, searchTerm: e.target.value })}
          />

          <input
            type="date"
            value={startDate}
            onChange={e => onChangeFilters({ ...filters, startDate: e.target.value })}
          />
          <input
            type="date"
            value={endDate}
            onChange={e => onChangeFilters({ ...filters, endDate: e.target.value })}
          />

          <select
            value={selectedVenue}
            onChange={e => onChangeFilters({ ...filters, selectedVenue: e.target.value })}
          >
            <option value="">All Venues</option>
            {availableVenues.map((venue, index) => (
              <option key={index} value={venue}>
                {venue}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => {
              onChangeFilters({ ...filters, minPrice: e.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => onChangeFilters({ ...filters, maxPrice: e.target.value })}
          />

          <button
            className="refine-clear-button"
            onClick={clearFilters}
            style={{ marginTop: '10px' }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default RefineSearch;
