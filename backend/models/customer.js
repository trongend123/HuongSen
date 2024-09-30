import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: "Avatar",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
    },
    gmail: {
      type: String,
    },
    fullname: {
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
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customers", customerSchema);

export default Customer;
