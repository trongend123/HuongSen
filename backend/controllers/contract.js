import * as contractRepository from '../repositories/contract.js';

export const createContract = async (req, res) => {
  try {
    const contract = await contractRepository.createContract(req.body);
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContract = async (req, res) => {
  try {
    const contract = await contractRepository.findContractById(req.params.id);
    res.status(contract ? 200 : 404).json(contract || { message: 'Contract not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const updatedContract = await contractRepository.updateContractById(req.params.id, req.body);
    res.status(updatedContract ? 200 : 404).json(updatedContract || { message: 'Contract not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const deletedContract = await contractRepository.deleteContractById(req.params.id);
    res.status(deletedContract ? 200 : 404).json(deletedContract || { message: 'Contract not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await contractRepository.getAllContracts();
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
