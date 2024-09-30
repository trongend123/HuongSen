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

const Avatar = mongoose.model("Avatar", avatarSchema);

export default Avatar;
