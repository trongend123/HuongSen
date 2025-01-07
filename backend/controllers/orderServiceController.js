import OrderServiceRepository from '../repositories/orderServiceRepository.js';

// Tạo OrderService mới
export const createOrderService = async (req, res) => {
    try {
        const newOrderService = await OrderServiceRepository.create(req.body);
        res.status(201).json(newOrderService);
    } catch (error) {
        console.error('Error creating OrderService:', error);
        res.status(400).json({ message: 'Không thể tạo OrderService', error: error.message });
    }
};

// Lấy tất cả OrderServices
export const getAllOrderServices = async (req, res) => {
    try {
        const orderServices = await OrderServiceRepository.findAll();
        res.status(200).json(orderServices);
    } catch (error) {
        console.error('Error fetching OrderServices:', error);
        res.status(500).json({ message: 'Không thể lấy danh sách OrderServices', error: error.message });
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
        console.error(`Error fetching OrderService with ID ${req.params.id}:`, error);
        res.status(400).json({ message: 'Không thể lấy Order Service theo ID', error: error.message });
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
        console.error(`Error updating OrderService with ID ${req.params.id}:`, error);
        res.status(400).json({ message: 'Không thể cập nhật Order Service', error: error.message });
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
        console.error(`Error deleting OrderService with ID ${req.params.id}:`, error);
        res.status(400).json({ message: 'Không thể xóa Order Service', error: error.message });
    }
};

// Lấy OrderServices theo bookingId
export const getOrderServicesByBookingId = async (req, res) => {
    try {
        const orderServices = await OrderServiceRepository.findByBookingId(req.params.bookingId);
        if (!orderServices.length) {
            return res.status(404).json({ message: 'Không tìm thấy OrderServices theo bookingId' });
        }
        res.status(200).json(orderServices);
    } catch (error) {
        console.error(`Error fetching OrderServices by bookingId ${req.params.bookingId}:`, error);
        res.status(500).json({ message: 'Không thể lấy OrderServices theo bookingId', error: error.message });
    }
};

// Lấy OrderServices theo locationId
export const getOrderServicesByLocationId = async (req, res) => {
    const { locationId } = req.params;

    try {
        console.log(`Request received for locationId: ${locationId}`);
        const orderServices = await OrderServiceRepository.findByLocationIdAndRoomCategory(locationId);

        if (!orderServices.length) {
            return res.status(404).json({ message: 'Không tìm thấy OrderServices cho location này.' });
        }

        res.status(200).json(orderServices);
    } catch (error) {
        console.error(`Error fetching OrderServices for locationId ${locationId}:`, error);
        res.status(500).json({ message: 'Không thể lấy dịch vụ theo location', error: error.message });
    }
};
