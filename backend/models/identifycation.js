import mongoose, { Schema } from "mongoose";

// const identifycationSchema = new Schema(
//     {

//         categoryId: {
//             type: Schema.Types.ObjectId,
//             ref: "IdentityCategorys",
//             required: true,
//         },
//         code: {
//             type: String,
//             required: true,
//         },
//         dateStart: {
//             type: Date,
//             required: true,
//         },
//         dateEnd: {
//             type: Date,
//             required: true,
//         },
//         location: {
//             type: String,
//             required: true,
//         },
//         memberId: {
//             type: Schema.Types.ObjectId,
//             ref: "Members",
//             required: true,
//         },
//         cusAccId: {
//             type: Schema.Types.ObjectId,
//             ref: "CustomerAccounts",
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );
// fix code models

const identifycationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    customerID: {
      type: Schema.Types.ObjectId,
      ref: "Customers", // Tham chiếu đến bảng Customer
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Identifycations = mongoose.model("Identifycations", identifycationSchema);

export default Identifycations;
