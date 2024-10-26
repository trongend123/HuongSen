// repositories/orderServiceRepository.js
import OrderServices from '../models/orderService.js';

const OrderServiceRepository = {
    // Tạo OrderService mới
    create: async (data) => {
        return await OrderServices.create(data);
    },

    // Lấy tất cả OrderServices
    findAll: async () => {
        return await OrderServices.find()
            .populate('otherServiceId')
            .populate('bookingId');
    },

    // Tìm OrderService theo ID
    findById: async (id) => {
        return await OrderServices.findById(id)
            .populate('otherServiceId')
            .populate('bookingId');
    },

    // Cập nhật OrderService
    update: async (id, data) => {
        return await OrderServices.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('otherServiceId')
            .populate('bookingId');
    },

    // Xóa OrderService
    remove: async (id) => {
        return await OrderServices.findByIdAndDelete(id);
    },

    // Lấy OrderServices theo bookingId (nếu cần)
    findByBookingId: async (bookingId) => {
        return await OrderServices.find({ bookingId })
            .populate('otherServiceId')
            .populate('bookingId');
    }
};

export default OrderServiceRepository;
