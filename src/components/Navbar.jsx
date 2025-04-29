import './Navbar.css';

function Navbar() {
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
