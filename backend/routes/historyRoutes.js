// routes/historyRoutes.js

import express from 'express';
import historyController from '../controllers/historyController.js';

const router = express.Router();

// Tạo lịch sử mới
router.post('/histories', historyController.createHistory);

// Lấy tất cả lịch sử
router.get('/histories', historyController.getAllHistories);

// Lấy lịch sử theo ID
router.get('/histories/:id', historyController.getHistoryById);

// Cập nhật lịch sử theo ID
router.put('/histories/:id', historyController.updateHistory);

// Xóa lịch sử theo ID
router.delete('/histories/:id', historyController.deleteHistory);

export default router;
