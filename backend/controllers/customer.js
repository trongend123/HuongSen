import Customer from "../models/customer.js";
import OrderRoom from "../models/orderRoom.js"; // Import mô hình orderRoom

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
    if (!customerAccount) {
      return res.status(404).json({ message: "Customer not found" });
    }
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

    // Đặt timeout để kiểm tra sau 10 giây
    setTimeout(async () => {
      try {
        // Kiểm tra xem có đơn hàng nào với customerId vừa tạo không
        const ordersCount = await OrderRoom.countDocuments({ customerId: newCustomer._id }).exec();

        // Nếu không có đơn hàng nào, xóa khách hàng
        if (ordersCount === 0) {
          await Customer.deleteOne({ _id: newCustomer._id });
          console.log(`Customer with ID ${newCustomer._id} has been deleted after 5 seconds.`);
        } else {
          console.log(`Customer with ID ${newCustomer._id} has existing orders and will not be deleted.`);
        }
      } catch (error) {
        console.error(`Error checking orders or deleting customer: ${error}`);
      }
    }, 5000); // 10 giây
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /customer-accounts/:id
const editCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// DELETE: /customer-accounts/:id
const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
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
