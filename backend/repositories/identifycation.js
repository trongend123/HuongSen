import Identifycation from "../models/identifycation.js";

// Create a new identification
const create = async ({ name, code, dateStart, dateEnd, location, customerID }) => {
    try {
        const newIdentifycation = await Identifycation.create({
            name,
            code,
            dateStart,
            dateEnd,
            location,
            customerID,
        });
        return newIdentifycation; // No need to return _doc since Mongoose returns the document directly
    } catch (error) {
        throw new Error(`Error creating identification: ${error.message}`);
    }
};

// Get all identifications
const list = async () => {
    try {
        return await Identifycation.find({})
            // Uncomment if you need to populate these fields
            // .populate("categoryId")
            // .populate("memberId")
            .populate("customerID")
            .exec();
    } catch (error) {
        throw new Error(`Error fetching identifications: ${error.message}`);
    }
};

// Get an identification by ID
const getById = async (id) => {
    try {
        const identification = await Identifycation.findById(id)
            // .populate("categoryId")
            // .populate("memberId")
            .populate("customerID")
            .exec();

        if (!identification) {
            throw new Error("Identification not found");
        }
        return identification;
    } catch (error) {
        throw new Error(`Error fetching identification by ID: ${error.message}`);
    }
};

// Update an identification by ID
const edit = async (id, { name, code, dateStart, dateEnd, location, customerID }) => {
    try {
        const updatedIdentifycation = await Identifycation.findByIdAndUpdate(
            id,
            {
                name,
                code,
                dateStart,
                dateEnd,
                location,
                customerID,
            },
            { new: true }
        );

        if (!updatedIdentifycation) {
            throw new Error("Identification not found");
        }

        return updatedIdentifycation;
    } catch (error) {
        throw new Error(`Error updating identification: ${error.message}`);
    }
};

// Delete an identification by ID
const deleteIdentifycation = async (id) => {
    try {
        const deletedIdentification = await Identifycation.findByIdAndDelete(id);

        if (!deletedIdentification) {
            throw new Error("Identification not found");
        }

        return deletedIdentification;
    } catch (error) {
        throw new Error(`Error deleting identification: ${error.message}`);
    }
};

// Get identification by customerID
const getByCustomerId = async (customerID) => {
    try {
        const identification = await Identifycation.findOne({ customerID })
            .populate('customerID')
            .exec();
        return identification;
    } catch (error) {
        throw new Error(`Error fetching identification by customer ID: ${error.message}`);
    }
};

export default {
    create,
    list,
    getById,
    edit,
    deleteIdentifycation,
    getByCustomerId
};
