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

      .populate('customerId')
      .populate('bookingId');
  },

  // Tìm OrderRoom theo ID
  findById: async (id) => {
    return await OrderRoom.findById(id)
      .populate('customerId')
      .populate('bookingId');
  },

  // Lấy OrderRooms theo bookingId
  findByBookingId: async (bookingId) => {
    return await OrderRoom.find({ bookingId })

      .populate('customerId')
      .populate('bookingId');
  },

  // Cập nhật OrderRoom
  update: async (id, data) => {
    return await OrderRoom.findByIdAndUpdate(id, data, { new: true, runValidators: true })

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


  getTotalByCategoryInDateRange: async (checkInDate, checkOutDate) => {
    try {
      const result = await OrderRoom.aggregate([
        {
          // Nối bảng OrderRoom với bảng Booking qua bookingId
          $lookup: {
            from: 'bookings', // Tên bảng Booking
            localField: 'bookingId', // Trường trong OrderRoom
            foreignField: '_id', // Trường trong Booking
            as: 'bookingDetails' // Tên mảng chứa thông tin nối
          }
        },
        {
          // Tách mảng bookingDetails thành tài liệu riêng lẻ
          $unwind: {
            path: '$bookingDetails',
            preserveNullAndEmptyArrays: false // Loại bỏ OrderRoom không có Booking tương ứng
          }
        },
        {
          // Lọc theo khoảng thời gian và trạng thái hợp lệ
          $match: {
            $or: [
              {
                // receiveRoom nằm trong khoảng thời gian
                receiveRoom: { $gte: new Date(checkInDate), $lte: new Date(checkOutDate), $ne: new Date(checkOutDate) }
              },
              {
                // returnRoom nằm trong khoảng thời gian
                returnRoom: { $gte: new Date(checkInDate), $lte: new Date(checkOutDate), $ne: new Date(checkInDate) }
              },
              {
                // Khoảng thời gian giao nhận nằm trọn trong khoảng yêu cầu
                $and: [
                  { receiveRoom: { $lte: new Date(checkInDate) } },
                  { returnRoom: { $gte: new Date(checkOutDate) } }
                ]
              }
            ],
            'bookingDetails.status': { $in: ['Đã check-in', 'Đã đặt'] } // Trạng thái hợp lệ
          }
        },
        {
          // Nhóm theo roomCategory và tính tổng số phòng
          $group: {
            _id: '$roomCategory._id', // Nhóm theo roomCategory._id
            totalRooms: { $sum: '$quantity' } // Tổng số phòng từ trường 'quantity'
          }
        },
        {
          // Dự kiến kết quả với roomCateId và tổng số phòng
          $project: {
            _id: 0, // Không trả về _id
            roomCateId: '$_id', // Trả về roomCateId
            totalRooms: 1 // Bao gồm tổng số phòng
          }
        }
      ]);

      return result;
    } catch (error) {
      console.error('Error in getTotalByCategoryInDateRange:', error);
      throw new Error('Lỗi khi truy vấn tổng số phòng theo roomCategory trong khoảng thời gian.');
    }
  }





};



export default OrderRoomRepository;
