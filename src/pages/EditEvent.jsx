import React, { useState, useEffect } from 'react';
import TicketOption from '../components/TicketOption';
import './CreateEvent.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';


const EditEvent = () => {
    const { id: eventID } = useParams();
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        // Update event
        await fetch(`http://localhost:5000/events/${eventID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                organiserID: cookies.userCookie.username}),
            credentials: 'include'
        });

        // Update each ticket option
        for (const option of ticketOptions) {
            await fetch(`http://localhost:5000/ticketOptions/${option.ticketOptionID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventID,
                ticketType: option.ticketOption,
                price: parseFloat(option.price),
                quantity: parseInt(option.ticketCapacity, 10),
            }),
            credentials: 'include'
            });
        }

        navigate('/');
        } catch (err) {
        console.error('Error updating event or tickets:', err);
        }
    };

    useEffect(() => {
        // Fetch event info
        fetch(`http://localhost:5000/events/${eventID}`)
        .then(res => res.json())
        .then(data => {
            setFormData({
            eventName: data.eventName || '',
            eventType: data.eventType || '',
            eventDate: data.eventDate || '',
            eventTime: data.eventTime || '',
            eventDesc: data.eventDesc || '',
            performer: data.performer || '',
            venueID: data.venueID || ''
            });
        });

        // Fetch ticket options
        fetch(`http://localhost:5000/ticketOptions/byEvent/${eventID}`)
        .then(res => res.json())
        .then(data => {
            const formatted = data.map(opt => ({
            ticketOptionID: opt.ticketOptionID,
            ticketOption: opt.ticketType,
            price: opt.price,
            ticketCapacity: opt.quantity
            }));
            setTicketOptions(formatted);
        });

        // Fetch venues
        fetch('http://localhost:5000/venues')
        .then(res => res.json())
        .then(data => setVenues(data));
    }, [eventID]);

    return (
        <div className="event-wrapper">
        <h1 className="title">Edit Event</h1>
        <form className="event-form" onSubmit={handleSubmit}>
            <input name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} />
            <input name="eventType" placeholder="Event Type" value={formData.eventType} onChange={handleChange} />
            <input name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} />
            <input name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} />
            <input name="eventDesc" placeholder="Description" value={formData.eventDesc} onChange={handleChange} />
            <input name="performer" placeholder="Performer" value={formData.performer} onChange={handleChange} />

            <select className='venue-selector' name="venueID" value={formData.venueID} onChange={handleChange}>
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
                key={option.ticketOptionID || index}
                index={index}
                data={option}
                onChange={handleTicketChange}
                onRemove={removeTicketOption}
            />
            ))}

            <button type="button" onClick={addTicketOption} className="add-btn">+ Add Ticket Option</button>
            <button type="submit" className="submit-btn">Save Changes</button>
        </form>
        </div>
    );
};

export default EditEvent;
