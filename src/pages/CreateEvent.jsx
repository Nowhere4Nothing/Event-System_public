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

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    eventDesc: '',
    performer: '',
    venueID: '',
  });

  const [ticketOptions, setTicketOptions] = useState([
    { ticketOption: '', price: '', ticketCapacity: '' }
  ]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTicketChange = (index, name, value) => {
    const updated = [...ticketOptions];
    updated[index][name] = value;
    setTicketOptions(updated);
  };

  const addTicketOption = () => {
    setTicketOptions([...ticketOptions, { ticketOption: '', price: '', ticketCapacity: '' }]);
  };

  const removeTicketOption = (indexToRemove) => {
    const updated = ticketOptions.filter((_, index) => index !== indexToRemove);
    setTicketOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventResponse = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organiserID: cookies.userCookie.username
        }),
        credentials: 'include'
      });

      const eventData = await eventResponse.json();
      const newEventID = eventData.eventID;

      const enrichedTickets = ticketOptions.map(option => ({
        eventID: newEventID,
        ticketType: option.ticketOption,
        price: parseFloat(option.price),
        quantity: parseInt(option.ticketCapacity, 10)
      }));

      await fetch('http://localhost:5000/ticketOptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedTickets),
        credentials: 'include'
      });

      navigate('/');
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  useEffect(() => {
    if (cookies.userCookie && cookies.userCookie.userType === 'Organiser') {
      setUser(cookies.userCookie.username);
    } else {
      navigate('/login');
    }

    fetch('http://localhost:5000/venues')
      .then(res => res.json())
      .then(data => {
        setVenues(data);
      });
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

        <select className="venue-selector" name="venueID" onChange={handleChange}>
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
