import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './AccountPage.css';
import EventBar from '../components/EventBar';
import CreateEventButton from '../components/CreateEventButton';

function AccountPage() {
  const [cookies, setCookies, removeCookies] = useCookies(['userCookie']);
  const [userDetails, setUserDetails] = useState({
    username: 'johndoe',
    email: 'johndoe@example.com',
    address: '123 Main St',
    phone: '123-456-7890',
    accountType: 'Guest', // or 'Organiser'
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
    fetch('http://localhost:5000/events', {credentials: 'include',})
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
    
    setUserDetails({
      username: cookies.userCookie.username,
      email: cookies.userCookie.email,
      address: cookies.userCookie.address,
      phone: cookies.userCookie.phone,
      accountType: cookies.userCookie.userType
    })

  }, []);

  function handleLogout() {
    removeCookies('userCookie', { path: '/' });
    window.location.href = '/login';
  }

  return (
    <div className="account-page">
      <h1 className="account-title">My Account</h1>

      <div className="account-content">
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
              <button onClick={() => handleLogout()}>Logout</button>
            </div>
          )}
        </div>

        <div className="events-section">
          <div className="events-header">
            <h2>My {userDetails.accountType === "Guest" ? (<span>Booked</span>) : (<span>Organized</span>)} Events</h2>
            {userDetails.accountType === "Organiser" ? (<span className='event-button-holder'><CreateEventButton /></span>) : (<span></span>)}
          </div>
          {loadingDbEvents ? (
            <p>Loading events from DB...</p>
          ) : dbEvents.length === 0 ? (
            <p>No events found in DB.</p>
          ) : (
            dbEvents.map(event => (
              <EventBar key={event.eventID} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;