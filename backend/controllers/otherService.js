import { OtherServiceRepo } from "../repositories/index.js";
// GET: /otherServices
const getOtherServices = async (req, res) => {
  try {
    res.status(200).json(await OtherServiceRepo.list());
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /otherServices/1
const getOtherServiceById = async (req, res) => {
  try {
    res.status(200).json(await OtherServiceRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /otherServices
const createOtherService = async (req, res) => {
  try {
    // Get object from request body

    const {
        name,
        price,
        description,
    } = req.body;
    const newOtherService = await OtherServiceRepo.create({
        name,
        price,
        description,
    });
    res.status(201).json(newOtherService);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /otherServices/1
const editOtherService = async (req, res) => {
  try {
    res.status(200).json(await OtherServiceRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /otherServices/1
const deleteOtherService = async (req, res) => {
  try {
    res.status(200).json(await OtherServiceRepo.deleteOtherService(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getOtherServices,
  getOtherServiceById,
  createOtherService,
  editOtherService,
  deleteOtherService,
};
