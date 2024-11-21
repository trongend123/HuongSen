import express from "express";
import { CustomerController } from "../controllers/index.js";

const customerRouter = express.Router();

// GET: /customer-accounts -> Get all customer accounts
customerRouter.get("/", CustomerController.getCustomers);

// GET: /customer-accounts/:id -> Get customer account by Id
customerRouter.get("/:id", CustomerController.getCustomerById);

// POST: /customer-accounts -> Create a new customer account
customerRouter.post("/", CustomerController.createCustomer);

// PUT: /customer-accounts/:id -> Update customer account by Id
customerRouter.put("/:id", CustomerController.editCustomer);

// DELETE: /customer-accounts/:id -> Delete customer account by Id
customerRouter.delete("/:id", CustomerController.deleteCustomer);

// GET: /customer-accounts/:bookingId -> Get customer account by bookingId
customerRouter.get("/customer-accounts/:bookingId", CustomerController.getCustomerByBookingId);
export default customerRouter;
