import { LocationRepo } from "../repositories/index.js";
// GET: /locaions
const getLocations = async (req, res) => {
  try {
    res.status(200).json(await LocationRepo.list());
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /locaions/1
const getLocationById = async (req, res) => {
  try {
    res.status(200).json(await LocationRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /locaions
const createLocation = async (req, res) => {
  try {
    // Get object from request body

    const {
        address,
        phone,
        name,
        image,
        feedback,
    } = req.body;
    const newLocation = await LocationRepo.create({
        address,
        phone,
        name,
        image,
        feedback,
    });
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /locaions/1
const editLocation = async (req, res) => {
  try {
    res.status(200).json(await LocationRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /locaions/1
const deleteLocation = async (req, res) => {
  try {
    res.status(200).json(await LocationRepo.deleteLocation(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getLocations,
  getLocationById,
  createLocation,
  editLocation,
  deleteLocation,
};
