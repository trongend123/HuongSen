// controllers/taxController.js

import taxRepository from '../repositories/taxRepository.js';

class TaxController {
    // Tạo thuế mới
    async createTax(req, res) {
        try {
            const data = req.body;
            const existingTax = await taxRepository.getTaxByCode(data.code);
            if (existingTax) {
                return res.status(400).json({ message: 'Tax code already exists' });
            }
            const tax = await taxRepository.createTax(data);
            res.status(201).json(tax);
        } catch (error) {
            console.error('Error creating tax:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Lấy tất cả thuế
    async getAllTaxes(req, res) {
        try {
            const taxes = await taxRepository.getAllTaxes();
            res.status(200).json(taxes);
        } catch (error) {
            console.error('Error fetching taxes:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Lấy thuế theo ID
    async getTaxById(req, res) {
        try {
            const { id } = req.params;
            const tax = await taxRepository.getTaxById(id);
            if (!tax) {
                return res.status(404).json({ message: 'Tax not found' });
            }
            res.status(200).json(tax);
        } catch (error) {
            console.error('Error fetching tax:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Cập nhật thuế theo ID
    async updateTax(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            // Nếu code được cập nhật, kiểm tra xem code có tồn tại không
            if (data.code) {
                const existingTax = await taxRepository.getTaxByCode(data.code);
                if (existingTax && existingTax._id.toString() !== id) {
                    return res.status(400).json({ message: 'Tax code already exists' });
                }
            }
            const updatedTax = await taxRepository.updateTax(id, data);
            if (!updatedTax) {
                return res.status(404).json({ message: 'Tax not found' });
            }
            res.status(200).json(updatedTax);
        } catch (error) {
            console.error('Error updating tax:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Xóa thuế theo ID
    async deleteTax(req, res) {
        try {
            const { id } = req.params;
            const deletedTax = await taxRepository.deleteTax(id);
            if (!deletedTax) {
                return res.status(404).json({ message: 'Tax not found' });
            }
            res.status(200).json({ message: 'Tax deleted successfully' });
        } catch (error) {
            console.error('Error deleting tax:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new TaxController();
