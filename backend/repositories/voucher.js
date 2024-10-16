// import Voucher from "../models/voucher.js";

// // Create voucher
// const create = async (data) => {
//   try {
//     const newVoucher = await Voucher.create(data);
//     return newVoucher._doc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get all vouchers
// const list = async () => {
//   try {
//     return await Voucher.find({}).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get voucher by id
// const getById = async (id) => {
//   try {
//     return await Voucher.findOne({ _id: id }).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Edit voucher
// const edit = async (id, data) => {
//   try {
//     const updatedVoucher = await Voucher.findByIdAndUpdate(
//       { _id: id },
//       data,
//       { new: true }
//     );

//     if (!updatedVoucher) {
//       throw new Error("Voucher not found");
//     }

//     return updatedVoucher;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Delete voucher
// const deleteVoucher = async (id) => {
//   try {
//     return await Voucher.findByIdAndDelete({ _id: id });
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// export default {
//   create,
//   list,
//   getById,
//   edit,
//   deleteVoucher,
// };
