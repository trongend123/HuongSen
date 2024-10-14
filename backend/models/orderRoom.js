// models/OrderRoom.js
import mongoose from 'mongoose';
import RoomCategory from "./roomCategory.js";
import Customers from "./customer.js";
import Booking from "./booking.js";

const { Schema, model } = mongoose;

const orderRoomSchema = new Schema(
  {
    roomCateId: {
      type: Schema.Types.ObjectId,
      ref: RoomCategory,
      required: [true, 'roomCateId là bắt buộc']
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: Customers,
      required: [true, 'customerId là bắt buộc']
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: Booking,
      required: [true, 'bookingId là bắt buộc']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity là bắt buộc'],
      min: [1, 'Quantity phải ít nhất là 1']
    },
    // Bạn có thể thêm các trường khác nếu cần, ví dụ: totalPrice, status, etc.
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo và xuất model OrderRoom
const OrderRoom = model("OrderRoom", orderRoomSchema);
export default OrderRoom;
