// models/OrderService.js
import mongoose from 'mongoose';


const { Schema, model } = mongoose;

const orderServiceSchema = new Schema(
    {
        otherServiceId: {
            type: Schema.Types.ObjectId,
            ref: 'OtherServices',
            required: [true, 'otherServiceId là bắt buộc']
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Bookings',
            required: [true, 'bookingId là bắt buộc']
        },
        quantity: { type: Number },
        status: { type: String, required: true },
        note: { type: String }
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);


const OrderServices = model("OrderServices", orderServiceSchema);
export default OrderServices;
