// routes/booking.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');

// Route to display the booking form (GET request)
router.get('/booking', isLoggedIn, bookingController.renderBookingForm);

// Route to handle booking form submission (POST request)
router.post('/booking', isLoggedIn, wrapAsync(bookingController.createBooking));

module.exports = router;
