import { RoomRepo } from "../repositories/index.js";
// GET: /rooms
const getRooms = async (req, res) => {
  try {
    res.status(200).json(await RoomRepo.list());
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /rooms/1
const getRoomById = async (req, res) => {
  try {
    res.status(200).json(await RoomRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /rooms
const createRoom = async (req, res) => {
  try {
    // Get object from request body

    const {
        location,
        code, 
        name,
        numOfBed,
        numOfHuman,
        image,
        price,
        description
    } = req.body;
    const newRoom = await RoomRepo.create({
        location,
        code, 
        name,
        numOfBed,
        numOfHuman,
        image,
        price,
        description
    });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /rooms/1
const editRoom = async (req, res) => {
  try {
    res.status(200).json(await RoomRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /rooms/1
const deleteRoom = async (req, res) => {
  try {
    res.status(200).json(await RoomRepo.deleteRoom(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getRooms,
  getRoomById,
  createRoom,
  editRoom,
  deleteRoom,
};
