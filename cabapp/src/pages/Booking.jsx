import React, { useState } from 'react';
import AppNavbar from '../components/Navbar';
import './Booking.css';
import axios from 'axios'

const Bookings = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    cabType: '',
    passengers: 1,
    includeReturn: false,
    returnDate: '',
    returnTime: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'passengers' ? Math.min(Math.max(value, 1), 6) : value)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/createBooking', formData);
    console.log(res.data); 
  } catch (error) {
    console.error('Booking failed:', error.response?.data || error.message);
  }
};

  return (
    <div className="booking-bg">
      <AppNavbar />
      <div className="booking-outer">
        <h2 className="booking-title">Book Your Ride</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <input
              type="text"
              name="pickup"
              placeholder="Enter pickup address"
              value={formData.pickup}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Drop-off Location</label>
            <input
              type="text"
              name="dropoff"
              placeholder="Enter drop-off address"
              value={formData.dropoff}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ride Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ride Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cab Type</label>
            <select
              name="cabType"
              value={formData.cabType}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a Cab Type</option>
              <option value="Mini">Mini</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">No. of Passengers</label>
            <input
              type="number"
              name="passengers"
              min="1"
              max="6"
              value={formData.passengers}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <input
              type="checkbox"
              name="includeReturn"
              id="includeReturn"
              checked={formData.includeReturn}
              onChange={handleChange}
              style={{width: '18px', height: '18px'}}
            />
            <label htmlFor="includeReturn" className="form-label" style={{marginBottom: 0, cursor: 'pointer'}}>Include Return Journey</label>
          </div>

          {formData.includeReturn && (
            <>
              <div className="form-group">
                <label className="form-label">Return Date (optional)</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Return Time (optional)</label>
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="booking-btn"
          >
            Book Ride
          </button>
        </form>
      </div>
      <footer className="footer-section py-4 bg-dark text-light">
        <div className="container text-center">
          <div className="mb-2">&copy; {new Date().getFullYear()} CabApp. All rights reserved.</div>
          <div>
            <a href="#" className="text-light mx-2">Privacy Policy</a>|
            <a href="#" className="text-light mx-2">Terms</a>|
            <a href="#" className="text-light mx-2">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Bookings;
