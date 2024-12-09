import Staff from "../models/staff.js";
import bcrypt from 'bcrypt';

// GET: /staff-accounts
const getStaffs = async (req, res) => {
  try {
    res.status(200).json(await Staff.find());
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// GET: /staff-accounts/:id
const getStaffById = async (req, res) => {
  try {
    const staffAccount = await Staff.findById(req.params.id);
    res.status(200).json(staffAccount);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// POST: /staff-accounts
const createStaff = async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// // PUT: /staff-accounts/:id
// const editStaff = async (req, res) => {
//   try {
//     const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedStaff);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };
// PUT: /staff-accounts/:id
const editStaff = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // Lấy tất cả các trường ngoại trừ password

    // Nếu có trường password, mã hóa trước khi cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword; // Thay thế bằng mật khẩu đã mã hóa
    }

    // Tìm và cập nhật staff, trả về document mới sau khi cập nhật
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Nếu không tìm thấy staff, trả về lỗi
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: /staff-accounts/:id
const deleteStaff = async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Staff account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

export default {
  getStaffs,
  getStaffById,
  createStaff,
  editStaff,
  deleteStaff,
};
