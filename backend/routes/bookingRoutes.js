// routes/bookingRoutes.js

import express from 'express';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

// Tạo booking mới
router.post('/', bookingController.createBooking);

// Lấy tất cả bookings
router.get('/', bookingController.getAllBookings);

// Lấy booking theo ID
router.get('/:id', bookingController.getBookingById);

// Cập nhật booking theo ID
router.put('/:id', bookingController.updateBooking);

// Endpoint to update statuses
router.put('/update-statuses/:bookingId', bookingController.updateStatusesByBookingId);

// Xóa booking theo ID
router.delete('/:id', bookingController.deleteBooking);

//xóa all theo bookingId
router.delete("/all/:bookingId", bookingController.deleteAllByBookingID);

export default router;
