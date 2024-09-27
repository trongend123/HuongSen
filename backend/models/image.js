import mongoose, { Schema } from "mongoose";
const imageSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Images = mongoose.model("Images", imageSchema);

export default imageSchema;
