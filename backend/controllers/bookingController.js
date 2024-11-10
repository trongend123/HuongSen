// controllers/bookingController.js

import bookingRepository from '../repositories/bookingRepository.js';

class BookingController {
    // Tạo booking mới
    async createBooking(req, res) {
        try {
            const data = req.body;
            const booking = await bookingRepository.createBooking(data);
            res.status(201).json(booking);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

// Lấy tất cả bookings với phân trang
    async getAllBookings(req, res) {
        try {
            // Lấy thông tin phân trang từ query params
            const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
            const limit = parseInt(req.query.limit) || 7; // Mặc định là 7 bản ghi mỗi trang

            // Tính toán vị trí bắt đầu
            const skip = (page - 1) * limit;

            // Lấy dữ liệu từ repository với phân trang
            const bookings = await bookingRepository.getAllBookings(skip, limit);

            // Lấy tổng số bản ghi để tính tổng số trang
            const totalBookings = await bookingRepository.getTotalBookings();
            const totalPages = Math.ceil(totalBookings / limit);

            // Trả về dữ liệu với thông tin phân trang
            res.status(200).json({
                bookings,
                pagination: {
                    page,
                    limit,
                    totalPages,
                    totalBookings,
                },
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Lấy booking theo ID
    async getBookingById(req, res) {
        try {
            const { id } = req.params;
            const booking = await bookingRepository.getBookingById(id);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Cập nhật booking theo ID
    async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            console.log(data);
            const updatedBooking = await bookingRepository.updateBooking(id, data);
            if (!updatedBooking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(updatedBooking);
        } catch (error) {
            console.error('Error updating booking:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Xóa booking theo ID
    async deleteBooking(req, res) {
        try {
            const { id } = req.params;
            const deletedBooking = await bookingRepository.deleteBooking(id);
            if (!deletedBooking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (error) {
            console.error('Error deleting booking:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new BookingController();
