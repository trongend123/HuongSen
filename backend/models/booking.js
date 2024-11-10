import mongoose from 'mongoose';
import Tax from './tax.js';
import Staff from './staff.js';
const bookingSchema = new mongoose.Schema({
    taxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxes' },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: Staff },
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true },
    contract: { type: String },
    humans: { type: Number, required: true },
});

const Bookings = mongoose.model('Bookings', bookingSchema);
export default Bookings;
