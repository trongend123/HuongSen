// models/OrderService.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderServiceSchema = new Schema(
    {
        // Reference to the other service
        otherServiceId: {
            type: Schema.Types.ObjectId,
            ref: 'OtherServices',
            required: [true, 'otherServiceId là bắt buộc']
        },

        // Reference to the booking
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Bookings',
            required: [true, 'bookingId là bắt buộc']
        },


        // Quantity of the service
        quantity: {
            type: Number,
            required: true
        },

        // Optional note about the service
        note: {
            type: String
        },

        // Time of the service action (defaults to current date/time)
        time: {
            type: Date,
            default: Date.now
        },

        // Status of the service
        status: {
            type: String,
            default: 'Đã đặt',
            enum: ['Đã đặt','Đã hủy','Đã cung cấp','Đang sử dụng'],
            required: true
        }

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const OrderServices = model("OrderServices", orderServiceSchema);

export default OrderServices;
