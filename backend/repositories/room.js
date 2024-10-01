import Room from "../models/room.js";
// Create
const create = async ({
  location,
  code,
  name,
  numOfBed,
  numOfHuman,
  image,
  price,
  description
}) => {
  try {
    // Create new room
    const newRoom = await Room.create({
      location,
      code,
      name,
      numOfBed,
      numOfHuman,
      image,
      price,
      description
    });
    // Return newRoom object
    return newRoom._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all rooms
const list = async () => {
  try {
    return await Room.find({}).exec();
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
    description
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
        description
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
