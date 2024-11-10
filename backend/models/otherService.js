import mongoose, { Schema } from "mongoose";
const otherServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    isDeleted: {
      type: Boolean,
      default: false, // Mặc định chưa xóa
    },
  },
  {
    timestamps: true,
  }
);

const OtherServices = mongoose.model("OtherServices", otherServiceSchema);

export default OtherServices;
