import mongoose, { Schema } from "mongoose";

const voucherAccSchema = new Schema(
  {
    voucherId: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    cusAccId: {
      type: Schema.Types.ObjectId,
      ref: "CustomerAccount",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VoucherAcc = mongoose.model("VoucherAcc", voucherAccSchema);

export default VoucherAcc;
