import Contract from '../models/contract.js';

export const createContract = (data) => Contract.create(data);
export const findContractById = (id) => Contract.findById(id).populate('customerId agencyId bookingId');
export const updateContractById = (id, data) => Contract.findByIdAndUpdate(id, data, { new: true });
export const deleteContractById = (id) => Contract.findByIdAndDelete(id);
export const getAllContracts = () => Contract.find().populate('customerId agencyId bookingId');
