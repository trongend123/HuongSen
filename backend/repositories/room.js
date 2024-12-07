import Room from "../models/room.js";
// Create
// const create = async ({
//   location,
//   code, 
//   name,
//   numOfBed,
//   numOfHuman,
//   image,
//   price,
//   description,
//   status
// }) => {
//   try {
//     // Create new room
//     const newRoom = await Room.create({
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
//     // Return newRoom object
//     return newRoom._doc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };
// fix code create room
const create = async (req, res) => {
  try {
    const roomData = req.body; // Extract room data from the request body
    const newRoom = await Room.create(roomData); // Use the repository to create a room

    res.status(201).json({
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// Get all rooms
const list = async () => {
  try {
    return await Room.find({}).populate("roomCategoryId").populate("bookingId").exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await Room.findOne({ _id: id }).populate("roomCategoryId").populate("bookingId").exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {

    code,
    status,
    roomCategoryId,
    bookingId
  }
) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      { _id: id },
      {
        code,
        status,
        roomCategoryId,
        bookingId
      },
      { new: true }
    );

    if (!updatedRoom) {
      throw new Error("Room not found");
    }

    return updatedRoom;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteRoom = async (id) => {
  try {
    return await Room.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get all rooms by roomCategoryId and count total
const getRoomsByCategory = async (roomCategoryId) => {
  try {
    // Find rooms by roomCategoryId
    const rooms = await Room.find({ roomCategoryId }).populate("roomCategoryId").populate("bookingId").exec();

    // Calculate the total number of rooms in this category
    const totalRooms = rooms.length;

    return {
      rooms,
      totalRooms
    };
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get total number of rooms by each roomCategoryId
const getTotalRoomsByCategory = async () => {
  const categoryTotals = await Room.aggregate([
    { $group: { _id: "$roomCategoryId", totalRooms: { $sum: 1 } } },
    { $lookup: { from: "roomcategories", localField: "_id", foreignField: "_id", as: "category" } },
    { $unwind: "$category" },
    { $project: { _id: 0, category: "$category.name", roomCateId: "$category._id", totalRooms: 1 } }
  ]);
  return categoryTotals;
}

const getRoomsByBookingId = async (bookingId) => {
  try {
    // Tìm tất cả các phòng theo bookingId
    const rooms = await Room.find({ bookingId }).populate('roomCategoryId').populate("bookingId");
    return rooms;
  } catch (error) {
    throw new Error(`Error fetching rooms by bookingId: ${error.message}`);
  }
};

export default {
  create,
  list,
  getById,
  edit,
  deleteRoom,
  getRoomsByCategory,
  getTotalRoomsByCategory,
  getRoomsByBookingId,
};
