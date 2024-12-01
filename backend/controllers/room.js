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
// const createRoom = async (req, res) => {
//   try {
//     // Get object from request body

//     const {
//         location,
//         code, 
//         name,
//         numOfBed,
//         numOfHuman,
//         image,
//         price,
//         description,
//         status
//     } = req.body;
//     const newRoom = await RoomRepo.create({
//         location,
//         code, 
//         name,
//         numOfBed,
//         numOfHuman,
//         image,
//         price,
//         description,
//         status
//     });
//     res.status(201).json(newRoom);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };
// fix code create room
const createRoom = async (req, res) => {
  try {
    // Check if req.body is defined and contains required fields
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required." });
    }

    const { code, status, roomCategoryId, bookingId } = req.body; // Extract necessary fields

    // Validate that required fields are provided
    if (!code || !status || !roomCategoryId) {
      return res.status(400).json({ message: "Missing required fields: code, status, and roomCategoryId are required." });
    }

    // Create a new room using RoomRepo
    const newRoom = await RoomRepo.create({
      code,
      status,
      roomCategoryId,
      bookingId // Use roomCategoryId
    });

    // Return the newly created room
    res.status(201).json({
      message: "Room created successfully",
      room: newRoom,
    });
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

// GET: /rooms/category/:roomCategoryId
const getRoomsInCategory = async (req, res) => {
  try {
    const { roomCategoryId } = req.params;

    // Fetch rooms in the given category and calculate total
    const { rooms, totalRooms } = await RoomRepo.getRoomsByCategory(roomCategoryId);

    res.status(200).json({
      message: `Found ${totalRooms} rooms in the category`,
      rooms,
      totalRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /rooms/category/totals
const getTotalRoomsByCategory = async (req, res) => {
  try {
    const categoryTotals = await RoomRepo.getTotalRoomsByCategory();

    res.status(200).json({
      message: "Total rooms by category",
      categoryTotals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};
// GET: /rooms/booking/:bookingId
const getRoomsByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Gọi repository để lấy danh sách phòng theo bookingId
    const rooms = await RoomRepo.getRoomsByBookingId(bookingId);


    res.status(200).json({
      message: `Found ${rooms.length} rooms for bookingId: ${bookingId}`,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

export default {
  getRooms,
  getRoomById,
  createRoom,
  editRoom,
  deleteRoom,
  getRoomsInCategory,
  getTotalRoomsByCategory,
  getRoomsByBookingId,
};
