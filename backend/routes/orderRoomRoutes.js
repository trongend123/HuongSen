// routes/orderRoomRoutes.js
import express from 'express';
import {
  createOrderRoom,
  getAllOrderRooms,
  getOrderRoomById,
  updateOrderRoom,
  deleteOrderRoom,
  getOrderRoomsByBookingId,
  getTotalRoomsByCategoryInDateRange,
  getAllOrderRoomsbyPage,
  getAllOrderRoomsByExcel

} from '../controllers/orderRoomController.js';

const router = express.Router();

// Routes
router.post('/', createOrderRoom);         // Tạo OrderRoom 
router.get('/', getAllOrderRooms);
router.get('/excel', getAllOrderRoomsByExcel);
router.get('/page', getAllOrderRoomsbyPage);         // Lấy tất cả OrderRooms
router.get('/totalbycategory', getTotalRoomsByCategoryInDateRange);     //GET /orderrooms/total-by-category?checkInDate=2024-10-01&checkOutDate=2024-10-15

router.get('/:id', getOrderRoomById);     // Lấy OrderRoom theo ID
router.get('/booking/:bookingId', getOrderRoomsByBookingId);     // Lấy OrderRoom theo bookingId

router.put('/:id', updateOrderRoom);      // Cập nhật OrderRoom
router.delete('/:id', deleteOrderRoom);   // Xóa OrderRoom
//router.get('/excel', generateExcel);   // Lấy tất cả OrderRooms
export default router;
