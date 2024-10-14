import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    bookingid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', required: true },
    staffid: { type: mongoose.Schema.Types.ObjectId, ref: 'Staffs', required: true },
    old_info: { type: Object, required: true }
});

const Historys = mongoose.model('Histories', historySchema);
export default Historys;
