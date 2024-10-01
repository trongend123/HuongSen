import express from "express";
import { StaffController } from "../controllers/index.js";

const staffRouter = express.Router();

// GET: /staff-accounts -> Get all staff accounts
staffRouter.get("/", StaffController.getStaffs);

// GET: /staff-accounts/:id -> Get staff account by Id
staffRouter.get("/:id", StaffController.getStaffById);

// POST: /staff-accounts -> Create a new staff account
staffRouter.post("/", StaffController.createStaff);

// PUT: /staff-accounts/:id -> Update staff account by Id
staffRouter.put("/:id", StaffController.editStaff);

// DELETE: /staff-accounts/:id -> Delete staff account by Id
staffRouter.delete("/:id", StaffController.deleteStaff);

export default staffRouter;
