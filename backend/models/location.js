import mongoose, { Schema } from "mongoose";
import imageSchema from "./image.js";
// import feedbackSchema from "./feedback.js";
const locationSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: [imageSchema],
    // feedback: [feedbackSchema],
  },
  {
    timestamps: true,
  }
);

const Locations = mongoose.model("Locations", locationSchema);

export default Locations;
