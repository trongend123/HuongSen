// routes/memberRoutes.js

import express from 'express';
import memberController from '../controllers/memberController.js';

const router = express.Router();

// Tạo member mới
router.post('/', memberController.createMember);

// Lấy tất cả members
router.get('/', memberController.getAllMembers);

// Lấy member theo ID
router.get('/:id', memberController.getMemberById);

// Cập nhật member theo ID
router.put('/:id', memberController.updateMember);

// Xóa member theo ID
router.delete('/:id', memberController.deleteMember);

export default router;
