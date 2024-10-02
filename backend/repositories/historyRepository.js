// repositories/historyRepository.js

import History from '../models/history.js';

class HistoryRepository {
    // Tạo lịch sử mới
    async createHistory(data) {
        const history = new History(data);
        return await history.save();
    }

    // Lấy tất cả lịch sử
    async getAllHistories() {
        return await History.find()
            .populate('bookingid')
            .populate('staffid')
            .exec();
    }

    // Lấy lịch sử theo ID
    async getHistoryById(id) {
        return await History.findById(id)
            .populate('bookingid')
            .populate('staffid')
            .exec();
    }

    // Cập nhật lịch sử theo ID
    async updateHistory(id, data) {
        return await History.findByIdAndUpdate(id, data, { new: true })
            .populate('bookingid')
            .populate('staffid')
            .exec();
    }

    // Xóa lịch sử theo ID
    async deleteHistory(id) {
        return await History.findByIdAndDelete(id);
    }
}

export default new HistoryRepository();
