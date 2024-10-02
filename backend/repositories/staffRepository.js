import Staff from '../models/staff.js';

export const createStaff = async (staffData) => {
    const staff = new Staff(staffData);
    return await staff.save();
};

export const getStaffById = async (id) => {
    return await Staff.findById(id);
};

export const getAllStaffs = async () => {
    return await Staff.find();
};

export const updateStaff = async (id, staffData) => {
    return await Staff.findByIdAndUpdate(id, staffData, { new: true });
};

export const deleteStaff = async (id) => {
    return await Staff.findByIdAndDelete(id);
};
