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
    return await Room.find({}).populate("roomCategoryId").exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await Room.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    location,
    code, 
    name,
    numOfBed,
    numOfHuman,
    image,
    price,
    description,
    status
  }
) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      { _id: id },
      {
        location,
        code, 
        name,
        numOfBed,
        numOfHuman,
        image,
        price,
        description,
        status
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
export default {
  create,
  list,
  getById,
  edit,
  deleteRoom,
};
