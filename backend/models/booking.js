import mongoose from 'mongoose';
import taxSchema from './tax.js';
import staffSchema from './staff.js';
const bookingSchema = new mongoose.Schema({
    taxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxes' },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staffs' },
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true }
});

const Bookings = mongoose.model('Bookings', bookingSchema);
export default Bookings;
