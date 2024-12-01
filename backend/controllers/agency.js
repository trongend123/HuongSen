import * as agencyRepository from '../repositories/agency.js';

export const createAgency = async (req, res) => {
  try {
    const agency = await agencyRepository.createAgency(req.body);
    res.status(201).json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgency = async (req, res) => {
  try {
    const agency = await agencyRepository.findAgencyById(req.params.id);
    res.status(agency ? 200 : 404).json(agency || { message: 'Agency not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAgency = async (req, res) => {
  try {
    const updatedAgency = await agencyRepository.updateAgencyById(req.params.id, req.body);
    res.status(updatedAgency ? 200 : 404).json(updatedAgency || { message: 'Agency not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAgency = async (req, res) => {
  try {
    const deletedAgency = await agencyRepository.deleteAgencyById(req.params.id);
    res.status(deletedAgency ? 200 : 404).json(deletedAgency || { message: 'Agency not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAgencies = async (req, res) => {
  try {
    const agencies = await agencyRepository.getAllAgencies();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAgencyByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const agency = await agencyRepository.findAgencyByCustomerId(customerId);
    res.status(200).json(agency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
