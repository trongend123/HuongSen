// repositories/historyRepository.js

import History from '../models/history.js';
import Booking from '../models/booking.js';
import OrderService from '../models/orderService.js';


class HistoryRepository {
    // Tạo lịch sử mới
    async createHistory(data) {
        const history = new History(data);
        return await history.save();
    }

    // Lấy tất cả lịch sử
    async getAllHistories() {
        return await History.find()
            .populate('bookingId')
            .populate('staffId')
            .exec();
    }

    // Lấy lịch sử theo ID
    async getHistoryById(Id) {
        return await History.findById(Id)
            .populate('bookingId')
            .populate('staffId')
            .exec();
    }

    // Cập nhật lịch sử theo ID
    async updateHistory(Id, data) {
        return await History.findByIdAndUpdate(Id, data, { new: true })
            .populate('bookingId')
            .populate('staffId')
            .exec();
    }

    // Xóa lịch sử theo ID
    async deleteHistory(Id) {
        return await History.findByIdAndDelete(Id);
    }

    // Lấy lịch sử theo bookingId
    async getHistoriesByBookingId(bookingId) {
        return await History.find({ bookingId: bookingId })
            .populate('bookingId')
            .populate('staffId')
            .exec();
    }


    // Lấy thông tin booking và orderServices theo bookingId
    async getDataByBookingId(bookingId) {
        const booking = await Booking.findById(bookingId);
        const orderServices = await OrderService.find({ bookingId });

        if (!booking) {
            throw new Error('Booking not found');
        }

        return { booking, orderServices };
    }
}

export default new HistoryRepository();
