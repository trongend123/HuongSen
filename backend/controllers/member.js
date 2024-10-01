import { MemberRepo } from "../repositories/index.js";

// GET: /members
const getMembers = async (req, res) => {
    try {
        const members = await MemberRepo.list();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// GET: /members/:id
const getMemberById = async (req, res) => {
    try {
        const member = await MemberRepo.getById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// POST: /members
const createMember = async (req, res) => {
    try {
        const { fullname, email, phone, dob, gender, address, bookingId } =
            req.body;

        const newMember = await MemberRepo.create({
            fullname,
            email,
            phone,
            dob,
            gender,
            address,
            bookingId,
        });

        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// PUT: /members/:id
const editMember = async (req, res) => {
    try {
        const updatedMember = await MemberRepo.edit(req.params.id, req.body);
        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// DELETE: /members/:id
const deleteMember = async (req, res) => {
    try {
        const deletedMember = await MemberRepo.deleteMember(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.status(200).json(deletedMember);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

export default {
    getMembers,
    getMemberById,
    createMember,
    editMember,
    deleteMember,
};
