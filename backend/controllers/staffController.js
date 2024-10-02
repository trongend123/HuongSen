import * as staffRepository from '../repositories/staffRepository.js';

export const createStaff = async (req, res) => {
    try {
        const staff = await staffRepository.createStaff(req.body);
        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getStaffById = async (req, res) => {
    try {
        const staff = await staffRepository.getStaffById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllStaffs = async (req, res) => {
    try {
        const staffs = await staffRepository.getAllStaffs();
        res.json(staffs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const staff = await staffRepository.updateStaff(req.params.id, req.body);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const staff = await staffRepository.deleteStaff(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        res.status(204).json(); // No content
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
