// import mongoose, { Schema } from "mongoose";
// import imageSchema from "./image.js";
// const roomSchema = new Schema(
//   {
//     location: {
//         type: Schema.Types.ObjectId,
//         ref: "locations",
//     },
//     code: {
//       type: String,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     numOfBed: {
//       type: Number,
//       required: true,
//     },
//     numOfHuman: {
//       type: Number,
//       required: true,
//     },
//     image: [imageSchema],
//     price: {
//       type: Number,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ["Trống","Đã booking", "checkin", "checkout"],
//       default: "Trống",
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// const Rooms = mongoose.model("Rooms", roomSchema);

// export default Rooms;
//fix model room
import mongoose, { Schema } from "mongoose";
import RoomCategory from "./roomCategory.js"; // Import RoomCategory for reference

const roomSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Trống", "Đã đặt", "Đang sử dụng", "Đang sửa chữa"],
      default: "Trống",
    },
    roomCategoryId: {
      type: Schema.Types.ObjectId,
      ref: RoomCategory, // Referencing RoomCategory model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rooms = mongoose.model("Rooms", roomSchema);

export default Rooms;

