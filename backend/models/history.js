import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    old_info: { type: Object, required: true }
});

const History = mongoose.model('History', historySchema);
export default History;
