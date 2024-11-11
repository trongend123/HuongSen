import OrderRoom from '../models/orderRoom.js';

const OrderRoomRepository = {
  // Tạo OrderRoom mới
  create: async (data) => {
    return await OrderRoom.create(data);
  },

  // Lấy tất cả OrderRooms với phân trang
  findAll: async (skip, limit) => {
    return await OrderRoom.find()
      .skip(skip)  // Bắt đầu từ vị trí skip
      .limit(limit)  // Giới hạn số bản ghi trên mỗi trang
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
  },

  // Hàm lấy tổng số OrderRooms
  getTotalOrderRooms: async () => {
    try {
      // Sử dụng aggregate để tính tổng số OrderRooms
      const totalOrderRooms = await OrderRoom.aggregate([
        {
          $group: {
            _id: null, // Không nhóm theo trường nào, chỉ tính tổng
            total: { $sum: 1 } // Tổng số bản ghi
          }
        }
      ]);

      // Trả về tổng số OrderRooms
      return totalOrderRooms[0] ? totalOrderRooms[0].total : 0;
    } catch (error) {
      throw new Error(error.toString());
    }
  },

  // Lấy tổng số roomCateId trong khoảng từ check-in đến check-out trong bảng OrderRoom
  getTotalByCategoryInDateRange: async (checkInDate, checkOutDate) => {
    try {
      return await OrderRoom.aggregate([
        {
          // Nối bảng OrderRoom với bảng Booking thông qua trường bookingId
          $lookup: {
            from: 'bookings', // Tên bảng cần nối
            localField: 'bookingId', // Trường trong OrderRoom
            foreignField: '_id', // Trường trong Booking
            as: 'bookingDetails' // Tên trường chứa thông tin nối
          }
        },
        {
          // Tách (unwind) mảng bookingDetails thành các tài liệu riêng lẻ
          $unwind: '$bookingDetails'
        },
        {
          // Lọc các booking trong khoảng thời gian từ check-in đến check-out
          $match: {
            'bookingDetails.checkin': { $gte: new Date(checkInDate) }, // Kiểm tra ngày check-in
            'bookingDetails.checkout': { $lte: new Date(checkOutDate) }, // Kiểm tra ngày check-out
            'bookingDetails.status': 'In Progress' // Thêm điều kiện status
          }
        },
        {
          // Nhóm theo roomCateId và tính tổng số phòng theo từng loại
          $group: {
            _id: '$roomCateId', // Nhóm theo ID loại phòng
            totalRooms: { $sum: '$quantity' } // Tổng số phòng được đặt (giả định trường 'quantity' chứa số lượng phòng)
          }
        },
        {
          // Dự kiến kết quả cuối cùng với roomCateId và tổng số phòng
          $project: {
            _id: 0, // Không trả về trường _id
            roomCateId: '$_id', // Trả về roomCateId
            totalRooms: 1 // Trả về tổng số phòng
          }
        }
      ]);
    } catch (error) {
      throw new Error(error.toString()); // Bắt lỗi và ném ra thông báo lỗi
    }
  }

};



export default OrderRoomRepository;
