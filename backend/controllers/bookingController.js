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

    // Lấy tất cả bookings
    async getAllBookings(req, res) {
        try {
            const bookings = await bookingRepository.getAllBookings();
            res.status(200).json(bookings);
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
