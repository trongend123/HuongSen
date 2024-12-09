import Booking from '../models/booking.js';
import OrderRoom from '../models/orderRoom.js';
import OrderService from '../models/orderService.js';
import BookingHistory from '../models/history.js';
import Customer from '../models/customer.js';
import Agency from '../models/agency.js';
import Identify from '../models/identifycation.js';
import Rooms from '../models/room.js';

class BookingRepository {
    // Tạo booking mới
    async createBooking(data) {
        const booking = new Booking(data);
        return await booking.save();
    }

    // Lấy tất cả bookings với phân trang
    async getAllBookings() {
        return await Booking.find()
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

    // Xóa booking và tất cả dữ liệu liên quan
    async deleteBookingWithRelatedData(bookingId) {
        try {

            // Lấy danh sách OrderRoom liên quan đến Booking
            const orderRooms = await OrderRoom.find({ bookingId });

            // Lấy một customerId duy nhất từ các OrderRoom
            const customerId = orderRooms.length > 0 ? orderRooms[0].customerId : null;

            if (!customerId) return null; // Không tìm thấy customerId

            // Xóa các OrderRoom liên quan
            await OrderRoom.deleteMany({ bookingId });

            // Xóa các OrderService liên quan
            await OrderService.deleteMany({ bookingId });

            // Xóa các BookingHistory liên quan
            await BookingHistory.deleteMany({ bookingId });

            // Xóa Booking
            const booking = await Booking.findByIdAndDelete(bookingId);

            if (!booking) return null; // Không tìm thấy booking

            // Xóa Customer, Agency và Identify nếu cần
            // Nếu có customerId, xóa tất cả dữ liệu liên quan đến customer
            await Agency.deleteMany({ customerId });
            await Identify.deleteMany({ customerID: customerId });
            await Customer.findByIdAndDelete(customerId); // Xóa chỉ 1 Customer

            return true; // Xóa thành công
        } catch (error) {
            console.error("Error in repository:", error.message);
            throw new Error("Error in deleting booking and related data");
        }
    }
    //hàm phía dưới để update trạng thái  dịch vụ (đang phục vụ cho Hủy của admin)

    async updateOrderServiceStatusByBookingId(bookingId, status) {
        try {
            const result = await OrderService.updateMany(
                { bookingId: bookingId },
                { $set: { status: status } }
            );
            return result;
        } catch (error) {
            throw new Error(`Error updating order service status: ${error.message}`);
        }
    };

}

export default new BookingRepository();
