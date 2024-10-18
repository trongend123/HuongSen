// routes/historyRoutes.js

import express from 'express';
import historyController from '../controllers/historyController.js';

const router = express.Router();

// Tạo lịch sử mới
router.post('/', historyController.createHistory);

// Lấy tất cả lịch sử
router.get('/', historyController.getAllHistories);

// Lấy lịch sử theo ID
router.get('/:id', historyController.getHistoryById);

// Cập nhật lịch sử theo ID
router.put('/:id', historyController.updateHistory);

// Xóa lịch sử theo ID
router.delete('/:id', historyController.deleteHistory);

export default router;
