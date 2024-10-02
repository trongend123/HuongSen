// repositories/taxRepository.js

import Tax from '../models/tax.js';

class TaxRepository {
    // Tạo thuế mới
    async createTax(data) {
        const tax = new Tax(data);
        return await tax.save();
    }

    // Lấy tất cả thuế
    async getAllTaxes() {
        return await Tax.find().exec();
    }

    // Lấy thuế theo ID
    async getTaxById(id) {
        return await Tax.findById(id).exec();
    }

    // Lấy thuế theo mã code
    async getTaxByCode(code) {
        return await Tax.findOne({ code }).exec();
    }

    // Cập nhật thuế theo ID
    async updateTax(id, data) {
        return await Tax.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
    }

    // Xóa thuế theo ID
    async deleteTax(id) {
        return await Tax.findByIdAndDelete(id).exec();
    }
}

export default new TaxRepository();
