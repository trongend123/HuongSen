import { OtherServiceRepo } from "../repositories/index.js";

// GET: /otherServices
const getOtherServices = async (req, res) => {
  try {
    const otherServices = await OtherServiceRepo.list();
    res.status(200).json(otherServices);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching other services: ${error.message}`,
    });
  }
};

// GET: /otherServices/:id
const getOtherServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const service = await OtherServiceRepo.getById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching service by ID: ${error.message}`,
    });
  }
};

// POST: /otherServices
const createOtherService = async (req, res) => {
  try {
    const { name, price, description, serviceCate } = req.body;

    if (!name || !price || !description || !serviceCate) {
      return res
        .status(400)
        .json({ message: "All fields (name, price, description, serviceCate) are required" });
    }

    const newOtherService = await OtherServiceRepo.create({
      name,
      price,
      description,
      serviceCate,
    });

    res.status(201).json(newOtherService);
  } catch (error) {
    res.status(500).json({
      message: `Error creating other service: ${error.message}`,
    });
  }
};

// PUT: /otherServices/:id
const editOtherService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, serviceCate } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const updatedService = await OtherServiceRepo.edit(id, {
      name,
      price,
      description,
      serviceCate,
    });

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({
      message: `Error updating service: ${error.message}`,
    });
  }
};

// DELETE: /otherServices/:id
const deleteOtherService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const deletedService = await OtherServiceRepo.deleteOtherService(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service deleted successfully",
      deletedService,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error deleting service: ${error.message}`,
    });
  }
};

// PUT: /otherServices/:id/soft-delete
const softDeleteOtherService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const updatedService = await OtherServiceRepo.softDelete(id);

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: `Service ${updatedService.isDeleted ? "soft-deleted" : "restored"} successfully`,
      updatedService,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error soft deleting/restoring service: ${error.message}`,
    });
  }
};

export default {
  getOtherServices,
  getOtherServiceById,
  createOtherService,
  editOtherService,
  deleteOtherService,
  softDeleteOtherService,
};
