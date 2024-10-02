// routes/bookingRoutes.js

import express from 'express';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

// Tạo booking mới
router.post('/bookings', bookingController.createBooking);

// Lấy tất cả bookings
router.get('/bookings', bookingController.getAllBookings);

// Lấy booking theo ID
router.get('/bookings/:id', bookingController.getBookingById);

// Cập nhật booking theo ID
router.put('/bookings/:id', bookingController.updateBooking);

// Xóa booking theo ID
router.delete('/bookings/:id', bookingController.deleteBooking);

export default router;
