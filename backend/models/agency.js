import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  stk: { type: String, required: true },
  code: { type: String, required: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Customers',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Agencies', agencySchema);
