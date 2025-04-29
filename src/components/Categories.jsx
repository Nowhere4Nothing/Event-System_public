import React, { useState } from 'react';
import './Categories.css';

function Categories({ onSelect }) {
  const [active, setActive] = useState(null);
  const categories = ['Music', 'Tech', 'Free'];

  const handleClick = (category) => {
    setActive(category);
    onSelect && onSelect(category); // optional callback
  };

  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-button ${active === cat ? 'active' : ''}`}
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default Categories;
