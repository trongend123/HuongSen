// controllers/bookingController.js

import bookingRepository from '../repositories/bookingRepository.js';
import OrderRoom from "../models/orderRoom.js";
class BookingController {
    // Tạo booking mới
    async createBooking(req, res) {
        try {
            const data = req.body;
            const booking = await bookingRepository.createBooking(data);

            // Start a timeout to check for associated orders after 2 seconds
            setTimeout(async () => {
                try {
                    const hasOrder = await OrderRoom.exists({ bookingId: booking._id });

                    // If no orders are found, delete the booking
                    if (!hasOrder) {
                        await bookingRepository.deleteBooking(booking._id);
                        console.log(`Booking with ID ${booking._id} deleted due to no associated orders.`);
                    }
                } catch (checkError) {
                    console.error(`Error checking or deleting booking with ID ${booking._id}:`, checkError);
                }
            }, 2000);

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
            const booking = await bookingRepository.getAllBookings();
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
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
    //xóa tất cả theo booking id
    async deleteAllByBookingID(req, res) {


        try {
            const { bookingId } = req.params;
            const result = await bookingRepository.deleteBookingWithRelatedData(bookingId);

            if (!result) {
                return res.status(404).json({ message: `Booking not found  ${typeof (bookingId)}` });
            }

            res.status(200).json({
                message: "Booking and all related data deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting booking:", error.message);
            res.status(500).json({ message: "An error occurred", error: error.message });
        }
    };

    //update trạng thái phòng và service 1 lúc
    async updateStatusesByBookingId(req, res) {
        const { bookingId } = req.params;
        const { orderServiceStatus, bookingStatus } = req.body;

        try {
            // Update booking status using the updateBooking method
            const bookingUpdateResult = await bookingRepository.updateBooking(bookingId, { status: bookingStatus });

            if (!bookingUpdateResult) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Update order service statuses
            const orderServiceUpdateResult = await bookingRepository.updateOrderServiceStatusByBookingId(bookingId, orderServiceStatus);

            res.status(200).json({
                message: 'Booking and service statuses updated successfully',
                bookingUpdateResult,
                orderServiceUpdateResult,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Failed to update statuses',
                error: error.message,
            });
        }
    }
}

export default new BookingController();
