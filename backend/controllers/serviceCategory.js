import serviceCategoryRepository from "../repositories/serviceCategory.js";

const createServiceCategory = async (req, res) => {
    try {
        const { locationId, name } = req.body;

        if (!locationId || !name) {
            return res.status(400).json({
                success: false,
                message: "Both locationId and name are required.",
            });
        }

        const newServiceCategory = await serviceCategoryRepository.create({ locationId, name });

        res.status(201).json({
            success: true,
            data: newServiceCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllServiceCategories = async (req, res) => {
    try {
        const serviceCategories = await serviceCategoryRepository.list();

        res.status(200).json({
            success: true,
            data: serviceCategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceCategory = await serviceCategoryRepository.getById(id);

        if (!serviceCategory) {
            return res.status(404).json({
                success: false,
                message: "Service category not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: serviceCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { locationId, name } = req.body;

        if (!locationId && !name) {
            return res.status(400).json({
                success: false,
                message: "At least one field (locationId or name) is required for update.",
            });
        }

        const updatedServiceCategory = await serviceCategoryRepository.edit(id, { locationId, name });

        if (!updatedServiceCategory) {
            return res.status(404).json({
                success: false,
                message: "Service category not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedServiceCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteServiceCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedServiceCategory = await serviceCategoryRepository.deleteCategory(id);

        if (!deletedServiceCategory) {
            return res.status(404).json({
                success: false,
                message: "Service category not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Service category deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default {
    createServiceCategory,
    getAllServiceCategories,
    getServiceCategoryById,
    updateServiceCategory,
    deleteServiceCategory,
};
