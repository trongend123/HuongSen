// routes/orderRoomRoutes.js
import express from 'express';
import {
  createOrderRoom,
  getAllOrderRooms,
  getOrderRoomById,
  updateOrderRoom,
  deleteOrderRoom,
  getOrderRoomsByBookingId,
  getTotalRoomsByCategoryInDateRange
} from '../controllers/orderRoomController.js';

const router = express.Router();

// Routes
router.post('/', createOrderRoom);         // Tạo OrderRoom 
router.get('/', getAllOrderRooms);         // Lấy tất cả OrderRooms
router.get('/totalbycategory', getTotalRoomsByCategoryInDateRange);     //GET /orderrooms/total-by-category?checkInDate=2024-10-01&checkOutDate=2024-10-15

router.get('/:id', getOrderRoomById);     // Lấy OrderRoom theo ID
router.get('/booking/:bookingId', getOrderRoomsByBookingId);     // Lấy OrderRoom theo bookingId

router.put('/:id', updateOrderRoom);      // Cập nhật OrderRoom
router.delete('/:id', deleteOrderRoom);   // Xóa OrderRoom

export default router;
