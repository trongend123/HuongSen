import OrderRoomRepository from '../repositories/orderRoomRepository.js';
import RoomCategory from '../models/roomCategory.js';
import Customers from '../models/customer.js';
import Booking from '../models/booking.js';

// Hàm tạo OrderRoom mới
export const createOrderRoom = async (req, res) => {
  try {
    const { roomCateId, customerId, bookingId, quantity } = req.body;

    // Kiểm tra sự tồn tại của RoomCategory
    const roomCategory = await RoomCategory.findById(roomCateId);
    if (!roomCategory) {
      return res.status(404).json({ message: 'RoomCategory không tồn tại' });
    }

    // Kiểm tra sự tồn tại của Customer
    const customer = await Customers.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer không tồn tại' });
    }

    // Kiểm tra sự tồn tại của Booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    // Tạo OrderRoom mới
    const newOrderRoom = await OrderRoomRepository.create({
      roomCateId,
      customerId,
      bookingId,
      quantity
    });

    res.status(201).json(newOrderRoom);
  } catch (error) {
    console.error('Lỗi khi tạo OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// // Hàm lấy tất cả OrderRooms với phân trang
// export const getAllOrderRooms = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;  // Trang mặc định là 1
//     const limit = parseInt(req.query.limit) || 7; // Số bản ghi mỗi trang mặc định là 7
//     const skip = (page - 1) * limit;  // Tính vị trí bắt đầu

//     // Lấy dữ liệu OrderRooms với phân trang
//     const orderRooms = await OrderRoomRepository.findAll(skip, limit);

//     // Lấy tổng số OrderRooms để tính tổng số trang
//     const totalOrderRooms = await OrderRoomRepository.getTotalOrderRooms();
//     const totalPages = Math.ceil(totalOrderRooms / limit); // Tính tổng số trang

//     res.status(200).json(
//       {
//         orderRooms,
//         pagination: {
//           page,
//           limit,
//           totalPages,
//           totalOrderRooms,
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Lỗi khi lấy OrderRooms:', error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// Hàm lấy tất cả OrderRooms
export const getAllOrderRooms = async (req, res) => {
  try {
    const orderRooms = await OrderRoomRepository.findAll();
    res.status(200).json(orderRooms);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRooms:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy OrderRoom theo ID
export const getOrderRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderRoom = await OrderRoomRepository.findById(id);
    if (!orderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }
    res.status(200).json(orderRoom);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy OrderRooms theo bookingId
export const getOrderRoomsByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const orderRooms = await OrderRoomRepository.findByBookingId(bookingId);
    if (!orderRooms.length) {
      return res.status(404).json({ message: 'Không có OrderRoom nào cho BookingId này' });
    }
    res.status(200).json(orderRooms);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRoom theo BookingId:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm cập nhật OrderRoom
export const updateOrderRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Nếu cập nhật các trường tham chiếu, kiểm tra sự tồn tại
    if (updateData.roomCateId) {
      const roomCategory = await RoomCategory.findById(updateData.roomCateId);
      if (!roomCategory) {
        return res.status(404).json({ message: 'RoomCategory không tồn tại' });
      }
    }

    if (updateData.customerId) {
      const customer = await Customers.findById(updateData.customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer không tồn tại' });
      }
    }

    if (updateData.bookingId) {
      const booking = await Booking.findById(updateData.bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking không tồn tại' });
      }
    }

    const updatedOrderRoom = await OrderRoomRepository.update(id, updateData);

    if (!updatedOrderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }

    res.status(200).json(updatedOrderRoom);
  } catch (error) {
    console.error('Lỗi khi cập nhật OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm xóa OrderRoom
export const deleteOrderRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrderRoom = await OrderRoomRepository.remove(id);

    if (!deletedOrderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }

    res.status(200).json({ message: 'OrderRoom đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy tổng số phòng theo loại phòng trong khoảng thời gian
export const getTotalRoomsByCategoryInDateRange = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    // Kiểm tra nếu thiếu dữ liệu ngày
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Cần cung cấp checkInDate và checkOutDate' });
    }

    // Gọi đến repository để lấy tổng số phòng theo loại trong khoảng thời gian
    const totalRoomsByCategory = await OrderRoomRepository.getTotalByCategoryInDateRange(checkInDate, checkOutDate);

    res.status(200).json(totalRoomsByCategory);
  } catch (error) {
    console.error('Lỗi khi lấy tổng số phòng theo loại phòng:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};