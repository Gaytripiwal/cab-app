const express = require('express')
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const auth = require('../auth');

const router = express.Router();

router.post('/createBooking', auth, createBooking);
router.get('/myBookings', auth, getUserBookings);

// Get all bookings (admin/company usage)
router.get('/allBookings', getAllBookings);

module.exports =  router;
