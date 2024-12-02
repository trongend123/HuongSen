import historyRepository from '../repositories/historyRepository.js';

class HistoryController {
    // Tạo lịch sử mới
    async createHistory(req, res) {
        try {
            const data = req.body;
            const history = await historyRepository.createHistory(data);
            res.status(201).json(history);
        } catch (error) {
            console.error('Error creating history:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    // Tạo lịch sử mới
    async createHistoryBE(req, res) {
        try {
            const { bookingId, staffId, note } = req.body;

            // Lấy dữ liệu booking và orderServices theo bookingId
            const data = await historyRepository.getDataByBookingId(bookingId);

            // Chuẩn bị thông tin để lưu vào old_info
            const oldInfo = {
                booking: data.booking,
                orderServices: data.orderServices,
            };

            // Tạo lịch sử mới
            const history = await historyRepository.createHistory({
                bookingId,
                staffId,
                old_info: oldInfo,
                note,
            });

            res.status(201).json(history);
        } catch (error) {
            console.error('Error creating history:', error);
            if (error.message === 'Booking not found') {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    // Lấy tất cả lịch sử
    async getAllHistories(req, res) {
        try {
            const histories = await historyRepository.getAllHistories();
            res.status(200).json(histories);
        } catch (error) {
            console.error('Error fetching histories:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Lấy lịch sử theo ID
    async getHistoryById(req, res) {
        try {
            const { id } = req.params;
            const history = await historyRepository.getHistoryById(id);
            if (!history) {
                return res.status(404).json({ message: 'History not found' });
            }
            res.status(200).json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Lấy lịch sử theo bookingId
    async getHistoriesByBookingId(req, res) {
        try {
            const { bookingId } = req.params;
            const histories = await historyRepository.getHistoriesByBookingId(bookingId);
            if (!histories || histories.length === 0) {
                return res.json({ success: false });
            }
            res.status(200).json(histories);
        } catch (error) {
            console.error('Error fetching histories by bookingId:', error);
            es.json({ success: false });
        }
    }

    // Cập nhật lịch sử theo ID
    async updateHistory(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedHistory = await historyRepository.updateHistory(id, data);
            if (!updatedHistory) {
                return res.status(404).json({ message: 'History not found' });
            }
            res.status(200).json(updatedHistory);
        } catch (error) {
            console.error('Error updating history:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Xóa lịch sử theo ID
    async deleteHistory(req, res) {
        try {
            const { id } = req.params;
            const deletedHistory = await historyRepository.deleteHistory(id);
            if (!deletedHistory) {
                return res.status(404).json({ message: 'History not found' });
            }
            res.status(200).json({ message: 'History deleted successfully' });
        } catch (error) {
            console.error('Error deleting history:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new HistoryController();
