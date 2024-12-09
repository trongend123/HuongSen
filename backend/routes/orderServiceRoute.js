// routes/OrderServiceRoute.js
import express from 'express';
import {
    createOrderService,
    getAllOrderServices,
    getOrderServiceById,
    updateOrderService,
    deleteOrderService,
    getOrderServicesByBookingId,
    getOrderServicesByLocationId
} from '../controllers/orderServiceController.js';

const router = express.Router();

// Tạo mới OrderService
router.post('/', createOrderService);

// Lấy tất cả OrderServices
router.get('/', getAllOrderServices);

// Lấy OrderService theo ID
router.get('/:id', getOrderServiceById);

// Cập nhật OrderService theo ID
router.put('/:id', updateOrderService);

// Xóa OrderService theo ID
router.delete('/:id', deleteOrderService);

// Lấy OrderServices theo bookingId
router.get('/booking/:bookingId', getOrderServicesByBookingId);

// Endpoint to get order services by locationId
router.get('/location/:locationId', getOrderServicesByLocationId);

export default router;
