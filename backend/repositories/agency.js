import Agency from '../models/agency.js';

export const createAgency = (data) => Agency.create(data);
export const findAgencyById = (id) => Agency.findById(id);
export const updateAgencyById = (id, data) => Agency.findByIdAndUpdate(id, data, { new: true });
export const deleteAgencyById = (id) => Agency.findByIdAndDelete(id);
export const getAllAgencies = () => Agency.find();
export const findAgencyByCustomerId = async (customerId) => {
    try {
        return await Agency.findOne({ customerId });
    } catch (error) {
        throw new Error(`Failed to retrieve agency for customerId ${customerId}: ${error.message}`);
    }
};
