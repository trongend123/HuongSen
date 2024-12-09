// repositories/orderServiceRepository.js
import OrderServices from '../models/orderService.js';
import Bookings from '../models/booking.js'
import OrderRooms from '../models/orderRoom.js'
import RoomCates from '../models/roomCategory.js'
import Locations from '../models/location.js'



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
    },
    // Lấy OrderService theo OrderService ID và Location ID
    findByLocationIdAndRoomCategory: async (locationId) => {
        try {
          console.log(`Fetching order rooms for locationId: ${locationId}`);
    
          // Lấy tất cả RoomCategories cho locationId
          const roomCategories = await RoomCates.find({ locationId }).populate('locationId');
          if (roomCategories.length === 0) {
            throw new Error('No room categories found for locationId');
          }
          
          // Duyệt qua các roomCategories để tìm các OrderRooms liên quan
          const roomCateIds = roomCategories.map(roomCategory => roomCategory._id);
          console.log(`RoomCateIds found: `, roomCateIds);
    
          // Tìm các OrderRooms có roomCateId tương ứng
          const orderRooms = await OrderRooms.find({ roomCateId: { $in: roomCateIds } })
            .populate('roomCateId') // Populate roomCateId nếu cần
            .populate('bookingId');  // Populate bookingId nếu cần
          
          if (orderRooms.length === 0) {
            throw new Error('No order rooms found for this location');
          }
    
          console.log('Order Rooms found: ', orderRooms);
          
          // Sau khi có orderRooms, lấy tất cả OrderServices liên quan
          const orderServices = await OrderServices.find({ bookingId: { $in: orderRooms.map(room => room.bookingId) } })
            .populate('otherServiceId')
            .populate('bookingId');
          
          return orderServices;  // Trả về order services tìm được
        } catch (error) {
          console.error(error);
          throw new Error('Không thể lấy dịch vụ theo location');
        }
      }
};

export default OrderServiceRepository;
