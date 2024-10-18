import RoomCategory from "../models/roomCategory.js";

class RoomCategoryRepository {
  async findAll() {
    return await RoomCategory.find()
      .populate('locationId', 'name') // Populate để lấy thông tin location
      .sort({ 'locationId': 1 }) // Sắp xếp theo tên location
      .exec();
  }
  async findById(id) {
    return await RoomCategory.findById(id).populate('locationId');
  }

  async create(data) {
    const roomCategory = new RoomCategory(data);
    return await roomCategory.save();
  }

  async update(id, data) {
    return await RoomCategory.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await RoomCategory.findByIdAndDelete(id);
  }
}

export default new RoomCategoryRepository();
