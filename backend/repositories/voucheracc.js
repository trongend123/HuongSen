// import VoucherAcc from "../models/voucheracc.js";

// // Create voucher account
// const create = async (data) => {
//   try {
//     const newVoucherAcc = await VoucherAcc.create(data);
//     return newVoucherAcc._doc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get all voucher accounts
// const list = async () => {
//   try {
//     return await VoucherAcc.find({}).populate('voucherId cusAccId').exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get voucher account by id
// const getById = async (id) => {
//   try {
//     return await VoucherAcc.findOne({ _id: id }).populate('voucherId cusAccId').exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Edit voucher account
// const edit = async (id, data) => {
//   try {
//     const updatedVoucherAcc = await VoucherAcc.findByIdAndUpdate(
//       { _id: id },
//       data,
//       { new: true }
//     );

//     if (!updatedVoucherAcc) {
//       throw new Error("Voucher account not found");
//     }

//     return updatedVoucherAcc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Delete voucher account
// const deleteVoucherAcc = async (id) => {
//   try {
//     return await VoucherAcc.findByIdAndDelete({ _id: id });
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// export default {
//   create,
//   list,
//   getById,
//   edit,
//   deleteVoucherAcc,
// };
