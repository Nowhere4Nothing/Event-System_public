
// CreateEvent.jsx - simplified, styled version of the event creation page
import React, { useState, useEffect } from 'react';
import TicketOption from '../components/TicketOption';
import './CreateEvent.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [cookies] = useCookies(['userCookie']);
  const [venues, setVenues] = useState([]);
  // State for basic event details
  const [formData, setFormData] = useState({
    eventName: '',
    performers: '',
  });

  // State for ticket options (initially one option)
  const [ticketOptions, setTicketOptions] = useState([
    { ticketType: '', price: '', quantity: '' }
  ]);

  // Update general event form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Update ticket option input fields
  const handleTicketChange = (index, name, value) => {
    const updated = [...ticketOptions];
    updated[index][name] = value;
    setTicketOptions(updated);
  };

  // Add a new ticket option section
  const addTicketOption = () => {
    setTicketOptions([...ticketOptions, { ticketType: '', price: '', quantity: '' }]);
  };

  // Remove a ticket option by index
  const removeTicketOption = (indexToRemove) => {
    const updated = ticketOptions.filter((_, index) => index !== indexToRemove);
    setTicketOptions(updated);
  };

  // Submit the form (combine all inputs into one object and log it)
  const handleSubmit = (e) => {
    e.preventDefault();
    const completeData = {
      ...formData,
      ticketOptions: ticketOptions,
      organiserID: cookies.userCookie.username
    };
    console.log('Complete Event Submission:', completeData);
    
  fetch('http://localhost:5000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(completeData),
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      console.log('Event created:', data);
      for(const option of ticketOptions) {
        saveTicketOption(data.eventID, option);
      }
      navigate('/');
    })
    .catch(err => {
      console.error('Error creating event:', err);
    });

    
  
};

  function saveTicketOption(eventID, ticketOption) {

    const fullTicketOption = {
      eventID,
      ...ticketOption
    };

    fetch('http://localhost:5000/ticketOptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fullTicketOption),
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      console.log('Ticket options created:', data);
    })
    .catch(err => {
      console.error('Error creating ticket options:', err);
    });
  }

  useEffect(() => {
    if(cookies.userCookie && cookies.userCookie.userType === 'Organiser') {
      setUser(cookies.userCookie.username)
    } else {
      navigate('/login'); // If they somehow get to the create events page while logged out (or not an organiser), kick them back to login
    }

    fetch('http://localhost:5000/venues')
    .then(res => res.json())
    .then(data => {
      console.log('Fetched venue details:', data);
      setVenues(data);
    })
  }, []);

  return (
    <div className="event-wrapper">
      <h1 className="title">Create New Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <input name="eventName" placeholder="Event Name" onChange={handleChange} />
        <input name="eventType" placeholder="Event Type" onChange={handleChange} />
        <input name="eventDate" type="date" onChange={handleChange} />
        <input name="eventTime" type="time" onChange={handleChange} />
        <input name="eventDesc" placeholder="Description" onChange={handleChange} />
        <input name="performer" placeholder="Performer" onChange={handleChange} />
        
        <select className='venue-selector' name="venueID" onChange={handleChange}>
          <option value="">Select Venue</option>
          {venues.map((venue) => (
            <option key={venue.venueID} value={venue.venueID}>
              {venue.venueName}
            </option>
          ))}
        </select>

        <h3>Ticket Options</h3>
        {ticketOptions.map((option, index) => (
          <TicketOption
            key={index}
            index={index}
            data={option}
            onChange={handleTicketChange}
            onRemove={removeTicketOption}
          />
        ))}

        <button type="button" onClick={addTicketOption} className="add-btn">+ Add Ticket Option</button>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default CreateEvent;





