import mongoose from 'mongoose';
import taxSchema from './tax.js';
import staffSchema from './staff.js';
const bookingSchema = new mongoose.Schema({
    taxid: { type: mongoose.Schema.Types.ObjectId, ref: taxSchema, required: true },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: staffSchema, required: true },
=======
    taxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxes', required: true },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staffs' },
>>>>>>> dfb4fbc749bc3ed886c5d3538f4b262821d187b0
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true }
});

const Booking = mongoose.model('Bookings', bookingSchema);
export default Booking;
