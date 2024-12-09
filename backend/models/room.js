import mongoose, { Schema } from "mongoose";
import RoomCategory from "./roomCategory.js"; // Import RoomCategory for reference
import Booking from "./booking.js";

const roomSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Trống", "Đã book", "Đang sử dụng", "Đang sửa chữa"],
      default: "Trống",
    },
    roomCategoryId: {
      type: Schema.Types.ObjectId,
      ref: RoomCategory, // Referencing RoomCategory model
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: Booking, // Referencing Booking model
    },
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

export default Rooms;

