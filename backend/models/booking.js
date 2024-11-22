import mongoose from 'mongoose';
import Tax from './tax.js';
import Staff from './staff.js';
const bookingSchema = new mongoose.Schema({
    taxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxes' },
    status: { type: String, required: true, enum: ['Đã đặt','Đã check-in','Đã hủy','Đã hoàn thành', 'Yêu cầu hoàn tiền'], },
    //payment lưu số tiền đã thanh toán, cọc or phòng và dịch vụ đặt trước
    payment: { type: Number, required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: Staff },
    price: { type: Number, required: true },
    checkin: { type: Date, required: true },
    note: { type: String },
    checkout: { type: Date, required: true },
    contract: { type: String },
    humans: { type: Number, required: true },
}
,
    {
        timestamps: true,
    });

const Bookings = mongoose.model('Bookings', bookingSchema);
export default Bookings;
