// routes/taxRoutes.js

import express from 'express';
import taxController from '../controllers/taxController.js';

const router = express.Router();

// Tạo thuế mới
router.post('/taxes', taxController.createTax);

// Lấy tất cả thuế
router.get('/taxes', taxController.getAllTaxes);

// Lấy thuế theo ID
router.get('/taxes/:id', taxController.getTaxById);

// Cập nhật thuế theo ID
router.put('/taxes/:id', taxController.updateTax);

// Xóa thuế theo ID
router.delete('/taxes/:id', taxController.deleteTax);

export default router;
