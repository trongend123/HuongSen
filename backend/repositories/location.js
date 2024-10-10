import Location from "../models/location.js";
// Create
const create = async ({
    address,
    phone,
    name,
    image,
    feedback,
}) => {
  try {
    // Create new location
    const newLocation = await Location.create({
        address,
        phone,
        name,
        image,
        feedback,
    });
    // Return newLocation object
    return newLocation._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all locations
const list = async () => {
  try {
    return await Location.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await Location.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    address,
    phone,
    name,
    image,
    feedback,
  }
) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      { _id: id },
      {
        address,
        phone,
        name,
        image,
        feedback,
      },
      { new: true }
    );

    if (!updatedLocation) {
      throw new Error("Location not found");
    }

    return updatedLocation;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteLocation = async (id) => {
  try {
    return await Location.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  create,
  list,
  getById,
  edit,
  deleteLocation,
};
