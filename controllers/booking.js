// controllers/bookingController.js

const Booking = require('../models/booking'); // Assuming a Booking model exists
const User = require('../models/user');       // If you want to associate bookings with users

// Render the booking form
module.exports.renderBookingForm = (req, res) => {
    res.render('booking');  // Render the booking.ejs template
};

// Handle booking form submission
module.exports.createBooking = async (req, res) => {
    const { name, email, phone, numberOfPerson, hotelName } = req.body;

    // Create a new booking object
    const newBooking = new Booking({
        name,
        email,
        phone,
        numberOfPerson,
        hotelName,
        user: req.user ? req.user._id : null  // Associate with logged-in user, if available
    });

    // Save the booking to the database
    await newBooking.save();

    // Flash a success message and redirect
    req.flash('success', 'Booking created successfully!');
    res.redirect('/listings');  // Redirect after successful booking
};
