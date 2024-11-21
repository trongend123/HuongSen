import { IdentifycationRepo } from "../repositories/index.js";

// GET: /identifycations
const getIdentifycations = async (req, res) => {
    try {
        const identifications = await IdentifycationRepo.list();
        return res.status(200).json(identifications);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching identifications: ${error.message}` });
    }
};

// GET: /identifycations/:id
const getIdentifycationById = async (req, res) => {
    try {
        const identification = await IdentifycationRepo.getById(req.params.id);
        if (!identification) {
            return res.status(404).json({ message: "Identification not found" });
        }
        return res.status(200).json(identification);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching identification: ${error.message}` });
    }
};

// POST: /identifycations
const createIdentifycation = async (req, res) => {
    try {
        const { name, code, dateStart, dateEnd, location, customerID } = req.body;

        // Validate required fields
        if (!name || !code || !dateStart || !dateEnd || !location || !customerID) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create new identification
        const newIdentification = await IdentifycationRepo.create({
            name,
            code,
            dateStart,
            dateEnd,
            location,
            customerID,
        });

        return res.status(201).json(newIdentification);
    } catch (error) {
        return res.status(500).json({ message: `Error creating identification: ${error.message}` });
    }
};

// PUT: /identifycations/:id
const editIdentifycation = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedIdentification = await IdentifycationRepo.edit(id, req.body);

        if (!updatedIdentification) {
            return res.status(404).json({ message: "Identification not found" });
        }

        return res.status(200).json(updatedIdentification);
    } catch (error) {
        return res.status(500).json({ message: `Error updating identification: ${error.message}` });
    }
};

// DELETE: /identifycations/:id
const deleteIdentifycation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIdentification = await IdentifycationRepo.deleteIdentifycation(id);

        if (!deletedIdentification) {
            return res.status(404).json({ message: "Identification not found" });
        }

        return res.status(200).json({ message: "Identification deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error deleting identification: ${error.message}` });
    }
};
// GET: /identifycations/customer/:customerID
const getIdentificationByCustomerId = async (req, res) => {
    try {
        const { customerID } = req.params;
        const identification = await IdentifycationRepo.getByCustomerId(customerID); // Assuming this method fetches a single record
        if (!identification) {
            return res.status(404).json({ message: "No identification found for this customer" });
        }
        return res.status(200).json(identification);
    } catch (error) {
        return res.status(500).json({ message: `Error fetching identification by customer ID: ${error.message}` });
    }
};
export default {
    getIdentifycations,
    getIdentifycationById,
    createIdentifycation,
    editIdentifycation,
    deleteIdentifycation,
    getIdentificationByCustomerId
};
