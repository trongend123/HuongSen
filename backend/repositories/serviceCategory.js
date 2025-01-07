import ServiceCategories from "../models/serviceCategory.js";

// Create
const create = async ({ locationId, name }) => {
    try {
        // Create a new service category
        const newServiceCategory = await ServiceCategories.create({ locationId, name });
        // Return the created object
        return newServiceCategory._doc;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get all service categories
const list = async () => {
    try {
        return await ServiceCategories.find({}).populate("locationId").exec();
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get service category by ID
const getById = async (id) => {
    try {
        return await ServiceCategories.findOne({ _id: id }).populate("locationId").exec();
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Edit service category
const edit = async (id, { locationId, name }) => {
    try {
        const updatedServiceCategory = await ServiceCategories.findByIdAndUpdate(
            { _id: id },
            { locationId, name },
            { new: true, runValidators: true }
        );

        if (!updatedServiceCategory) {
            throw new Error("Service category not found");
        }

        return updatedServiceCategory;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Delete service category
const deleteCategory = async (id) => {
    try {
        return await ServiceCategories.findByIdAndDelete({ _id: id });
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Export functions
export default {
    create,
    list,
    getById,
    edit,
    deleteCategory,
};
