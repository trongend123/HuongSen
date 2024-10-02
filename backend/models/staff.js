import mongoose, { Schema } from "mongoose";

const staffSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: "Avatars",
    },
  },
  {
    timestamps: true,
  }
);

const Staffs = mongoose.model("Staffs", staffSchema);

export default Staffs;
