import mongoose from 'mongoose';
import taxSchema from './tax.js';
import staffSchema from './staff.js';
const bookingSchema = new mongoose.Schema({
    taxid: { type: mongoose.Schema.Types.ObjectId, ref: taxSchema, required: true },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: staffSchema, required: true },
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true }
});

const Booking = mongoose.model('Bookings', bookingSchema);
export default Booking;
