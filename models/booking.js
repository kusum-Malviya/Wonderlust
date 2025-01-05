// models/booking.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    numberOfPerson: {
        type: Number,
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'  // Reference the User model
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
