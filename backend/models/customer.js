import mongoose, { Schema } from "mongoose";


const customerSchema = new Schema(
  {
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
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customers = mongoose.model("Customers", customerSchema);

export default Customers;
