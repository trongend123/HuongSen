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

// GET: /otherServices/:id
const getOtherServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;  // Retrieve the ID from request params
    const service = await OtherServiceRepo.getById(serviceId);  // Fetch the service using the repository function

    // if (!service) {
    //   return res.status(404).json({ message: 'Service not found' });  // If no service is found, return 404
    // }

    res.status(200).json(service);  // Return the service data with a 200 status code
  } catch (error) {
    res.status(500).json({
      message: error.toString(),  // Return the error message if an exception occurs
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

const softDeleteOtherService = async (req, res) => {
  try {
    const updatedService = await OtherServiceRepo.softDelete(req.params.id);
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
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
  softDeleteOtherService
};
