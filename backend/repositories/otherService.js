import OtherService from "../models/otherService.js";
// Create
const create = async ({
  name,
  price,
  description,
}) => {
  try {
    // Create new otherService
    const newOtherService = await OtherService.create({
      name,
      price,
      description,
    });
    // Return newOtherService object
    return newOtherService._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all otherServices
const list = async () => {
  try {
    return await OtherService.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await OtherService.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    name,
    price,
    description,
  }
) => {
  try {
    const updatedOtherService = await OtherService.findByIdAndUpdate(
      { _id: id },
      {
        name,
        price,
        description,
      },
      { new: true }
    );

    if (!updatedOtherService) {
      throw new Error("OtherService not found");
    }

    return updatedOtherService;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteOtherService = async (id) => {
  try {
    return await OtherService.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  create,
  list,
  getById,
  edit,
  deleteOtherService,
};
