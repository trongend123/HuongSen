// controllers/OrderServiceController.js
import OrderServiceRepository from '../repositories/orderServiceRepository.js';

// Tạo OrderService mới
export const createOrderService = async (req, res) => {
    try {
        const newOrderService = await OrderServiceRepository.create(req.body);
        res.status(201).json(newOrderService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy tất cả OrderServices
export const getAllOrderServices = async (req, res) => {
    try {
        const orderServices = await OrderServiceRepository.findAll();
        res.status(200).json(orderServices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy OrderService theo ID
export const getOrderServiceById = async (req, res) => {
    try {
        const orderService = await OrderServiceRepository.findById(req.params.id);
        if (!orderService) {
            return res.status(404).json({ message: 'Order Service không tồn tại' });
        }
        res.status(200).json(orderService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật OrderService theo ID
export const updateOrderService = async (req, res) => {
    try {
        const updatedOrderService = await OrderServiceRepository.update(req.params.id, req.body);
        if (!updatedOrderService) {
            return res.status(404).json({ message: 'Order Service không tồn tại' });
        }
        res.status(200).json(updatedOrderService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa OrderService theo ID
export const deleteOrderService = async (req, res) => {
    try {
        const deletedOrderService = await OrderServiceRepository.remove(req.params.id);
        if (!deletedOrderService) {
            return res.status(404).json({ message: 'Order Service không tồn tại' });
        }
        res.status(204).send(); // Trả về trạng thái 204 No Content
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy OrderServices theo bookingId (nếu cần)
export const getOrderServicesByBookingId = async (req, res) => {
    try {
        const orderServices = await OrderServiceRepository.findByBookingId(req.params.bookingId);
        res.status(200).json(orderServices);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Lấy OrderServices theo locationId (nếu cần)
export const getOrderServicesByLocationId = async (req, res) => {
    const { locationId } = req.params; // Lấy locationId từ tham số URL

    try {
        console.log(`Request received for locationId: ${locationId}`);
        const orderServices = await OrderServiceRepository.findByLocationIdAndRoomCategory(locationId);
        
        if (orderServices.length === 0) {
            return res.status(404).json({ message: 'No order services found for this location.' });
        }

        return res.status(200).json(orderServices);  // Trả về các OrderServices tìm được
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Không thể lấy dịch vụ theo location', error: error.message });
    }
};