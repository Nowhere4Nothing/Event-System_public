import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import EventBar from '../components/EventBar';

function AccountPage() {
  const [userDetails, setUserDetails] = useState({
    username: 'johndoe',
    email: 'johndoe@example.com',
    address: '123 Main St',
    phone: '123-456-7890',
    accountType: 'Guest', // or 'Organizer'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // SQLLite integration will go here
  };

  const [dbEvents, setDbEvents] = useState([]);
  const [loadingDbEvents, setLoadingDbEvents] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/events')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched DB events:', data);
        setDbEvents(data);
        setLoadingDbEvents(false);
      })
      .catch(err => {
        console.error('Error fetching events from DB:', err);
        setLoadingDbEvents(false);
      });
  }, []);

  return (
    <div className="account-page">
      <h1 className="account-title">My Account</h1>

      <div className="account-content">
        {/* User Details Section */}
        <div className="user-details-section">
          <h2>Account Details</h2>
          {isEditing ? (
            <form className="user-details-form">
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={userDetails.username}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                />
              </label>
              <p><strong>Account Type:</strong> {userDetails.accountType}</p>
              <button type="button" onClick={handleSave}>
                Save
              </button>
            </form>
          ) : (
            <div className="user-details-display">
              <p><strong>Username:</strong> {userDetails.username}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Address:</strong> {userDetails.address}</p>
              <p><strong>Phone:</strong> {userDetails.phone}</p>
              <p><strong>Account Type:</strong> {userDetails.accountType}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
        </div>

        {/* Booked/Organized events Section */}
        <div className="events-section">
          <h2>My {userDetails.accountType === "Guest" ? (<span>Booked</span>) : (<span>Organized</span>)} Events </h2>
          {loadingDbEvents ? (
            <p>Loading events from DB...</p>
          ) : dbEvents.length === 0 ? (
            <p>No events found in DB.</p>
          ) : (
            dbEvents.slice(3).map(event => (
              <EventBar key={event.eventID} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;