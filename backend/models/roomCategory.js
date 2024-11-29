import mongoose, { Schema } from "mongoose";
import Location from "./location.js"; // Import Location if needed for reference

const roomCategorySchema = new Schema(
  {
    numberOfBed: {
      type: Number,
      required: true,
    },
    numberOfHuman: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: Location,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RoomCategories = mongoose.model("RoomCategories", roomCategorySchema);

export default RoomCategories;
