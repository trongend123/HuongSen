import { IdentifycationRepo } from "../repositories/index.js";

// GET: /identifycations
const getIdentifycations = async (req, res) => {
    try {
        const identifications = await IdentifycationRepo.list();
        res.status(200).json(identifications);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// GET: /identifycations/:id
const getIdentifycationById = async (req, res) => {
    try {
        const identification = await IdentifycationRepo.getById(req.params.id);
        if (!identification) {
            return res.status(404).json({ message: "Identification not found" });
        }
        res.status(200).json(identification);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// POST: /identifycations
const createIdentifycation = async (req, res) => {
    try {
        const {
            categoryId,
            code,
            dateStart,
            dateEnd,
            location,
            memberId,
            cusAccId,
        } = req.body;

        // Tạo identification mới
        const newIdentification = await IdentifycationRepo.create({
            categoryId,
            code,
            dateStart,
            dateEnd,
            location,
            memberId,
            cusAccId,
        });

        res.status(201).json(newIdentification);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// PUT: /identifycations/:id
const editIdentifycation = async (req, res) => {
    try {
        const updatedIdentification = await IdentifycationRepo.edit(
            req.params.id,
            req.body
        );
        if (!updatedIdentification) {
            return res.status(404).json({ message: "Identification not found" });
        }
        res.status(200).json(updatedIdentification);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

// DELETE: /identifycations/:id
const deleteIdentifycation = async (req, res) => {
    try {
        const deletedIdentification = await IdentifycationRepo.deleteIdentifycation(
            req.params.id
        );
        if (!deletedIdentification) {
            return res.status(404).json({ message: "Identification not found" });
        }
        res.status(200).json(deletedIdentification);
    } catch (error) {
        res.status(500).json({
            message: error.toString(),
        });
    }
};

export default {
    getIdentifycations,
    getIdentifycationById,
    createIdentifycation,
    editIdentifycation,
    deleteIdentifycation,
};
