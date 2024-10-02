import Customer from "../models/customer.js";

// Create customer account
const create = async (data) => {
  try {
    const newCustomer = await Customer.create(data);
    return newCustomer._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get all customer accounts
const list = async () => {
  try {
    return await Customer.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Get customer account by id
const getById = async (id) => {
  try {
    return await Customer.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Edit customer account
const edit = async (id, data) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      { _id: id },
      data,
      { new: true }
    );

    if (!updatedCustomer) {
      throw new Error("Customer account not found");
    }

    return updatedCustomer;
  } catch (error) {
    throw new Error(error.toString());
  }
};

// Delete customer account
const deleteCustomer = async (id) => {
  try {
    return await Customer.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  create,
  list,
  getById,
  edit,
  deleteCustomer,
};
