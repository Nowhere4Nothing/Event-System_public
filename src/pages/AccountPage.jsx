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
    userType: 'Guest', // or 'Organiser'
  });
  const [oldUsername, setOldUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // password edit
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorText, setErrorText] = useState('');

  const startEdit = (e) => {
    setIsEditing(true);
    setOldUsername(userDetails.username);
  }

  const cancelEdit = (e) => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    setErrorText('');
    loadDetailsFromCookie();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (userDetails.username !== oldUsername) {
    try {
      const res = await fetch(`http://localhost:5000/users/${userDetails.username}`);
      if (res.ok) {
        setErrorText('That username is already taken.');
        return;
      }
    } catch (err) {
        setErrorText('Woah! Database check failed, try again.');
        console.error('Error checking username:', err);
        return;
    }
  }
    setErrorText('');
    setIsEditing(false);
    fetch('http://localhost:5000/users/' + oldUsername, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })
      .then(res => res.json())
      .then(data => {
        console.log('User details updated:', data);
        setCookies('userCookie', userDetails, { path: '/' });
      })
      .catch(err => {
        console.error('Error updating user details:', err);
      });
  };

  const [myDBEvents, setDbEvents] = useState([]);
  const [loadingDbEvents, setLoadingDbEvents] = useState(true);

  useEffect(() => {
    if(cookies.userCookie === undefined) {
      window.location.href = '/login'; // login first, bro
    }
    if(cookies.userCookie.userType == "Guest") {
        fetch('http://localhost:5000/tickets/' + cookies.userCookie.username)
          .then(res => res.json())
          .then(data => {
            console.log('Fetched tickets for user:', data);
            setDbEvents(data);
            setLoadingDbEvents(false);
          })
          .catch(err => {
            console.error('Error fetching tickets:', err);
            setLoadingDbEvents(false);
          });
    } else if(cookies.userCookie.userType == "Organiser") {
      fetch('http://localhost:5000/events/organiser/' + cookies.userCookie.username)
        .then(res => res.json())
        .then(data => { 
          console.log('Fetched events for organiser:', data);
          setDbEvents(data);
          setLoadingDbEvents(false);
        })
        .catch(err => {
          console.error('Error fetching events:', err);
          setLoadingDbEvents(false);
        });
    } else {
      console.error('Unknown user type:', cookies.userCookie.userType);
      setLoadingDbEvents(false);
    }
    
    loadDetailsFromCookie();

  }, []);

  function loadDetailsFromCookie() {
    setUserDetails({
      username: cookies.userCookie.username,
      email: cookies.userCookie.email,
      address: cookies.userCookie.address,
      phone: cookies.userCookie.phone,
      userType: cookies.userCookie.userType
    })  
  }

  function handleLogout() {
    removeCookies('userCookie', { path: '/' });
    window.location.href = '/login';
  }

  function startPasswordChange() {
    setIsChangingPassword(true);
    setNewPassword('');
    setConfirmPassword('');
    setErrorText('');
  }

  function savePasswordChange() {
    if(newPassword !== confirmPassword) {
      setErrorText('Passwords do not match!');
      return;
    }
    setErrorText('');
    fetch('http://localhost:5000/passwords/' + oldUsername, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Password updated:', data);
        setIsChangingPassword(false);
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(err => {
        console.error('Error updating password:', err);
      });
      cancelEdit(); //not actually cancelling but it exits the form so w/e
  }

  return (
    <div className="account-page">
      <h1 className="account-title">My Account</h1>

      <div className="account-content">
        <div className="user-details-section">
          <h2>Account Details</h2>
          {isEditing ? (
            isChangingPassword ? (
              <form className="user-details-form">
                <label>
                  New Password:
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </label>
                <label>
                  Confirm Password:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </label>
                {errorText && <p className="error-message">{errorText}</p>}
                <button type="button" onClick={savePasswordChange}>
                  Save
                </button>
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </form>
            ) : (
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
                <p><strong>Account Type:</strong> {userDetails.userType}</p>
                {errorText && <p className="error-message">{errorText}</p>}
                <button type="button" onClick={handleSave}>
                  Save
                </button>
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startPasswordChange}
                >
                  Change password
                </button>
              </form>
            )
          ) : (
            <div className="user-details-display">
              <p><strong>Username:</strong> {userDetails.username}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Address:</strong> {userDetails.address}</p>
              <p><strong>Phone:</strong> {userDetails.phone}</p>
              <p><strong>Account Type:</strong> {userDetails.userType}</p>
              <button onClick={() => startEdit()}>Edit</button>
              <button onClick={() => handleLogout()}>Logout</button>
            </div>
          )}
        </div>

        <div className="events-section">
          <div className="events-header">
            <h2>My {userDetails.userType === "Guest" ? (<span>Booked</span>) : (<span>Organized</span>)} Events</h2>
            {userDetails.userType === "Organiser" ? (<span className='event-button-holder'><CreateEventButton /></span>) : (<span></span>)}
          </div>
          {loadingDbEvents ? (
            <p>Loading...</p>
          ) : myDBEvents.length === 0 ? (
            <p>No events found!</p>
          ) : (
            userDetails.userType == "Organiser" ? (
            myDBEvents.map(event => (
              <EventBar key={event.eventID} event={event} />))
            ) : (
              // ticket bar todo later
              console.log('placeholder')
            )
          )}

        </div>
      </div>
    </div>
  );
}

export default AccountPage;