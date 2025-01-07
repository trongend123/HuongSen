import OrderServices from '../models/orderService.js';
import Bookings from '../models/booking.js';
import OrderRooms from '../models/orderRoom.js';
import RoomCates from '../models/roomCategory.js';
import Locations from '../models/location.js';

const OrderServiceRepository = {
  // Tạo OrderService mới
  create: async (data) => {
    try {
      return await OrderServices.create(data);
    } catch (error) {
      console.error('Error creating OrderService:', error);
      throw new Error('Không thể tạo OrderService');
    }
  },

  // Lấy tất cả OrderServices
  findAll: async () => {
    try {
      return await OrderServices.find()
        .populate('bookingId');
    } catch (error) {
      console.error('Error fetching all OrderServices:', error);
      throw new Error('Không thể lấy danh sách OrderServices');
    }
  },

  // Tìm OrderService theo ID
  findById: async (id) => {
    try {
      return await OrderServices.findById(id)
        .populate('bookingId');
    } catch (error) {
      console.error(`Error finding OrderService with ID ${id}:`, error);
      throw new Error('Không thể tìm OrderService theo ID');
    }
  },

  // Cập nhật OrderService
  update: async (id, data) => {
    try {
      return await OrderServices.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate('bookingId');
    } catch (error) {
      console.error(`Error updating OrderService with ID ${id}:`, error);
      throw new Error('Không thể cập nhật OrderService');
    }
  },

  // Xóa OrderService
  remove: async (id) => {
    try {
      return await OrderServices.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting OrderService with ID ${id}:`, error);
      throw new Error('Không thể xóa OrderService');
    }
  },

  // Lấy OrderServices theo bookingId
  findByBookingId: async (bookingId) => {
    try {
      return await OrderServices.find({ bookingId })
        .populate('bookingId');
    } catch (error) {
      console.error(`Error finding OrderServices by bookingId ${bookingId}:`, error);
      throw new Error('Không thể lấy OrderServices theo bookingId');
    }
  },

  // Lấy OrderService theo Location ID và Room Category
  findByLocationIdAndRoomCategory: async (locationId) => {
    try {
      console.log(`Fetching order rooms for locationId: ${locationId}`);

      // Lấy tất cả RoomCategories cho locationId
      const roomCategories = await RoomCates.find({ locationId }).populate('locationId');
      if (roomCategories.length === 0) {
        console.warn('No room categories found for locationId:', locationId);
        throw new Error('Không tìm thấy Room Categories cho location này');
      }

      // Lấy danh sách roomCateIds
      const roomCateIds = roomCategories.map(roomCategory => roomCategory._id);
      console.log(`RoomCateIds found:`, roomCateIds);

      // Tìm các OrderRooms liên quan
      const orderRooms = await OrderRooms.find({ roomCateId: { $in: roomCateIds } })
        .populate('roomCateId') // Populate roomCateId nếu cần
        .populate('bookingId'); // Populate bookingId nếu cần

      if (orderRooms.length === 0) {
        console.warn('No order rooms found for locationId:', locationId);
        throw new Error('Không tìm thấy OrderRooms cho location này');
      }

      console.log('Order Rooms found:', orderRooms);

      // Lấy tất cả OrderServices liên quan
      const orderServices = await OrderServices.find({ bookingId: { $in: orderRooms.map(room => room.bookingId) } })
        .populate('bookingId');

      return orderServices;
    } catch (error) {
      console.error('Error fetching services by locationId and room categories:', error);
      throw new Error('Không thể lấy dịch vụ theo location');
    }
  }
};

export default OrderServiceRepository;
