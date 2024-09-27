import { ImageRepo } from "../repositories/index.js";
// GET: /images
const getImages = async (req, res) => {
  try {
    res.status(200).json(await ImageRepo.list());
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /images/1
const getImageById = async (req, res) => {
  try {
    res.status(200).json(await ImageRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /images
const createImage = async (req, res) => {
  try {
    // Get object from request body

    const {
        caption,
        url,
    } = req.body;
    const newImage = await ImageRepo.create({
        caption,
        url,
    });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /images/1
const editImage = async (req, res) => {
  try {
    res.status(200).json(await ImageRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /images/1
const deleteImage = async (req, res) => {
  try {
    res.status(200).json(await ImageRepo.deleteImage(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getImages,
  getImageById,
  createImage,
  editImage,
  deleteImage,
};
