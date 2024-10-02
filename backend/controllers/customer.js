import Customer from "../models/customer.js";

// GET: /customer-accounts
const getCustomers = async (req, res) => {
  try {
    res.status(200).json(await Customer.find());
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// GET: /customer-accounts/:id
const getCustomerById = async (req, res) => {
  try {
    const customerAccount = await Customer.findById(req.params.id);
    res.status(200).json(customerAccount);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// POST: /customer-accounts
const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /customer-accounts/:id
const editCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// DELETE: /customer-accounts/:id
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Customer account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  editCustomer,
  deleteCustomer,
};
