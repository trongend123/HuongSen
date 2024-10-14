// routes/taxRoutes.js

import express from 'express';
import taxController from '../controllers/taxController.js';

const router = express.Router();

// Tạo thuế mới
router.post('/', taxController.createTax);

// Lấy tất cả thuế
router.get('/', taxController.getAllTaxes);

// Lấy thuế theo ID
router.get('/:id', taxController.getTaxById);

// Cập nhật thuế theo ID
router.put('/:id', taxController.updateTax);

// Xóa thuế theo ID
router.delete('/:id', taxController.deleteTax);

export default router;
