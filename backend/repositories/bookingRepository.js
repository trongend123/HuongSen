// repositories/bookingRepository.js

import Booking from '../models/booking.js';

class BookingRepository {
    // Tạo booking mới
    async createBooking(data) {
        const booking = new Booking(data);
        return await booking.save();
    }

    // Lấy tất cả bookings
    async getAllBookings() {
        return await Booking.find()
            .populate('taxId')
            .populate('staffId')
            .exec();
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
            .populate('taxid')
            .populate('staffid')
            .exec();
    }

    // Xóa booking theo ID
    async deleteBooking(id) {
        return await Booking.findByIdAndDelete(id).exec();
    }
}

export default new BookingRepository();
