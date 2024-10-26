import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agencies', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', required: true },
  deposit: { type: Number, required: true },
  note: { type: String },
}, { timestamps: true });

export default mongoose.model('Contracts', contractSchema);
