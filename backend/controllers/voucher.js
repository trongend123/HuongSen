// import Voucher from "../models/voucher.js";

// // GET: /vouchers
// const getVouchers = async (req, res) => {
//   try {
//     res.status(200).json(await Voucher.find());
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // GET: /vouchers/:id
// const getVoucherById = async (req, res) => {
//   try {
//     const voucher = await Voucher.findById(req.params.id);
//     res.status(200).json(voucher);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // POST: /vouchers
// const createVoucher = async (req, res) => {
//   try {
//     const newVoucher = await Voucher.create(req.body);
//     res.status(201).json(newVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // PUT: /vouchers/:id
// const editVoucher = async (req, res) => {
//   try {
//     const updatedVoucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedVoucher);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // DELETE: /vouchers/:id
// const deleteVoucher = async (req, res) => {
//   try {
//     await Voucher.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Voucher deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// export default {
//   getVouchers,
//   getVoucherById,
//   createVoucher,
//   editVoucher,
//   deleteVoucher,
// };
