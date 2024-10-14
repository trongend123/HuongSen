import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    taxid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', required: true },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true }
});

const Booking = mongoose.model('Bookings', bookingSchema);
export default Booking;
