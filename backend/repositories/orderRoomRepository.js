import OrderRoom from '../models/orderRoom.js';

const OrderRoomRepository = {
  // Tạo OrderRoom mới
  create: async (data) => {
    return await OrderRoom.create(data);
  },

  // Lấy tất cả OrderRooms
  findAll: async () => {
    return await OrderRoom.find()
      .populate('roomCateId')
      .populate('customerId')
      .populate('bookingId');
  },

  // Tìm OrderRoom theo ID
  findById: async (id) => {
    return await OrderRoom.findById(id)
      .populate('roomCateId')
      .populate('customerId')
      .populate('bookingId');
  },

  // Lấy OrderRooms theo bookingId
  findByBookingId: async (bookingId) => {
    return await OrderRoom.find({ bookingId })
      .populate('roomCateId')
      .populate('customerId')
      .populate('bookingId');
  },

  // Cập nhật OrderRoom
  update: async (id, data) => {
    return await OrderRoom.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('roomCateId')
      .populate('customerId')
      .populate('bookingId');
  },

  // Xóa OrderRoom
  remove: async (id) => {
    return await OrderRoom.findByIdAndDelete(id);
  }
};

export default OrderRoomRepository;
