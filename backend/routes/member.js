import express from "express";
import { MemberController } from "../controllers/index.js";

const memberRouter = express.Router();

// GET: /members -> Get all members
memberRouter.get("/", MemberController.getMembers);

// GET: /members/:id -> Get member by Id
memberRouter.get("/:id", MemberController.getMemberById);

// POST: /members -> Create a new member
memberRouter.post("/", MemberController.createMember);

// PUT: /members/:id -> Update a member by Id
memberRouter.put("/:id", MemberController.editMember);

// DELETE: /members/:id -> Delete a member by Id
memberRouter.delete("/:id", MemberController.deleteMember);

export default memberRouter;
