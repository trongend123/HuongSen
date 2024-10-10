import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: "Avatars",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // facebook: {
    //   type: String,
    // },
    // gmail: {
    //   type: String,
    // },
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
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      required: true,
    },
    deactive: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Customers = mongoose.model("Customers", customerSchema);

export default Customers;
