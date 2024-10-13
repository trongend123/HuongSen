import roomCategoryRepository from "../repositories/roomCategoryRepository.js";

class RoomCategoryController {
  async getAll(req, res) {
    try {
      const roomCategories = await roomCategoryRepository.findAll();
      res.json(roomCategories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const roomCategory = await roomCategoryRepository.findById(req.params.id);
      if (!roomCategory) return res.status(404).json({ message: "Room category not found" });
      res.json(roomCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req, res) {
    try {
      const roomCategory = await roomCategoryRepository.create(req.body);
      res.status(201).json(roomCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const updatedRoomCategory = await roomCategoryRepository.update(req.params.id, req.body);
      if (!updatedRoomCategory) return res.status(404).json({ message: "Room category not found" });
      res.json(updatedRoomCategory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedRoomCategory = await roomCategoryRepository.delete(req.params.id);
      if (!deletedRoomCategory) return res.status(404).json({ message: "Room category not found" });
      res.json({ message: "Room category deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new RoomCategoryController();
