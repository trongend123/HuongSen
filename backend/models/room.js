import mongoose, { Schema } from "mongoose";
import imageSchema from "./image.js";
const roomSchema = new Schema(
  {
    location: {
        type: Schema.Types.ObjectId,
        ref: "locations",
    },
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    numOfBed: {
      type: Number,
      required: true,
    },
    numOfHuman: {
      type: Number,
      required: true,
    },
    image: [imageSchema],
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

export default Rooms;
