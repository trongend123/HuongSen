import mongoose, { Schema } from "mongoose";

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
