// repositories/bookingRepository.js

import Booking from '../models/booking.js';

class BookingRepository {
    // Tạo booking mới
    async createBooking(data) {
        const booking = new Booking(data);
        return await booking.save();
    }

  // Lấy tất cả bookings với phân trang
    async getAllBookings(skip, limit) {
        return await Booking.find()
            .skip(skip) // Bắt đầu từ vị trí 'skip'
            .limit(limit) // Giới hạn số lượng bản ghi
            .populate('taxId')
            .populate('staffId')
            .exec();
    }

// Lấy tổng số bookings (để tính tổng số trang)
    async getTotalBookings() {
        return await Booking.countDocuments();
    }   

    // Lấy booking theo ID
    async getBookingById(id) {
        return await Booking.findById(id)
            .populate('taxId')
            .populate('staffId')
            .exec();
    }

    // Cập nhật booking theo ID
    async updateBooking(id, data) {
        return await Booking.findByIdAndUpdate(id, data, { new: true, runValidators: true })
            .populate('taxId')
            .populate('staffId')
            .exec();
            
    }

    // Xóa booking theo ID
    async deleteBooking(id) {
        return await Booking.findByIdAndDelete(id).exec();
    }
}

export default new BookingRepository();
