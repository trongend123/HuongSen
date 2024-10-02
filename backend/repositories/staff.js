import Staff from "../models/staff.js";

// Create staff account
const create = async (data) => {
  try {
    const newStaff = await Staff.create(data);
    return newStaff._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get all staff accounts
const list = async () => {
  try {
    return await Staff.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get staff account by id
const getById = async (id) => {
  try {
    return await Staff.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Edit staff account
const edit = async (id, data) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      { _id: id },
      data,
      { new: true }
    );

    if (!updatedStaff) {
      throw new Error("Staff account not found");
    }

    return updatedStaff;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Delete staff account
const deleteStaff = async (id) => {
  try {
    return await Staff.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  create,
  list,
  getById,
  edit,
  deleteStaff,
};
