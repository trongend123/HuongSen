// import VoucherAcc from "../models/voucheracc.js";

// // GET: /voucher-accs
// const getVoucherAccs = async (req, res) => {
//   try {
//     res.status(200).json(await VoucherAcc.find().populate('voucherId cusAccId'));
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // GET: /voucher-accs/:id
// const getVoucherAccById = async (req, res) => {
//   try {
//     const voucherAcc = await VoucherAcc.findById(req.params.id).populate('voucherId cusAccId');
//     res.status(200).json(voucherAcc);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // POST: /voucher-accs
// const createVoucherAcc = async (req, res) => {
//   try {
//     const newVoucherAcc = await VoucherAcc.create(req.body);
//     res.status(201).json(newVoucherAcc);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // PUT: /voucher-accs/:id
// const editVoucherAcc = async (req, res) => {
//   try {
//     const updatedVoucherAcc = await VoucherAcc.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedVoucherAcc);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // DELETE: /voucher-accs/:id
// const deleteVoucherAcc = async (req, res) => {
//   try {
//     await VoucherAcc.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Voucher account deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// export default {
//   getVoucherAccs,
//   getVoucherAccById,
//   createVoucherAcc,
//   editVoucherAcc,
//   deleteVoucherAcc,
// };
