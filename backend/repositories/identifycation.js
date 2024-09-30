import Identifycation from "../models/identifycation.js";

// Create a new identification
const create = async ({
    categoryId,
    code,
    dateStart,
    dateEnd,
    location,
    memberId,
    cusAccId,
}) => {
    try {
        const newIdentifycation = await Identifycation.create({
            categoryId,
            code,
            dateStart,
            dateEnd,
            location,
            memberId,
            cusAccId,
        });
        return newIdentifycation._doc;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get all identifications
const list = async () => {
    try {
        return await Identifycation.find({})
            .populate("categoryId")
            .populate("memberId")
            .populate("cusAccId")
            .exec();
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Get an identification by ID
const getById = async (id) => {
    try {
        return await Identifycation.findOne({ _id: id })
            .populate("categoryId")
            .populate("memberId")
            .populate("cusAccId")
            .exec();
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Update an identification by ID
const edit = async (
    id,
    {
        categoryId,
        code,
        dateStart,
        dateEnd,
        location,
        memberId,
        cusAccId,
    }
) => {
    try {
        const updatedIdentifycation = await Identifycation.findByIdAndUpdate(
            { _id: id },
            {
                categoryId,
                code,
                dateStart,
                dateEnd,
                location,
                memberId,
                cusAccId,
            },
            { new: true }
        );

        if (!updatedIdentifycation) {
            throw new Error("Identification not found");
        }

        return updatedIdentifycation;
    } catch (error) {
        throw new Error(error.toString());
    }
};

// Delete an identification by ID
const deleteIdentifycation = async (id) => {
    try {
        return await Identifycation.findByIdAndDelete({ _id: id });
    } catch (error) {
        throw new Error(error.toString());
    }
};


export default {
    create,
    list,
    getById,
    edit,
    deleteIdentifycation,
};
