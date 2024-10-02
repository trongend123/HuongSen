import mongoose, { Schema } from "mongoose";

const avatarSchema = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    base64: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Avatars = mongoose.model("Avatars", avatarSchema);

export default Avatar;
