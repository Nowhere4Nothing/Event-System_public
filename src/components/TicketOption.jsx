
// TicketOption.jsx - handles a single ticket option input block
import React from 'react';

const TicketOption = ({ index, data, onChange, onRemove }) => {
  // Handle change in any field (name, price, capacity)
  const handleChange = (e) => {
    onChange(index, e.target.name, e.target.value);
  };

  return (
    <div className="ticket-card">
      <input
        type="text"
        name="ticketType"
        placeholder="Option Name (e.g., VIP, General)"
        value={data.ticketType}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price ($)"
        value={data.price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="quantity"
        placeholder="Capacity"
        value={data.quantity}
        onChange={handleChange}
      />
      <button
        type="button"
        className="remove-btn"
        onClick={() => onRemove(index)}
      >
        Remove
      </button>
    </div>
  );
};

export default TicketOption;
