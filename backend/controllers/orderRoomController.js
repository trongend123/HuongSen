// controllers/orderRoomController.js
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
