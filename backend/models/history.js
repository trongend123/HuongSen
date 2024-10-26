import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bookings', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staffs' },
    old_info: { type: Object, required: true },
    note: { type: String }
},
    {
        timestamps: true,
    });

const Historys = mongoose.model('Histories', historySchema);
export default Historys;
