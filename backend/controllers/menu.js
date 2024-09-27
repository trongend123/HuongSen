import { MenuRepo } from "../repositories/index.js";
// GET: /menus
const getMenus = async (req, res) => {
  try {
    res.status(200).json(await MenuRepo.list());
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// GET: /menus/1
const getMenuById = async (req, res) => {
  try {
    res.status(200).json(await MenuRepo.getById(req.params.id));
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

// POST: /menus
const createMenu = async (req, res) => {
  try {
    // Get object from request body

    const {
        foodName,
        drinkName,
        price,
        description,
    } = req.body;
    const newMenu = await MenuRepo.create({
        foodName,
        drinkName,
        price,
        description,
    });
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// PUT: /menus/1
const editMenu = async (req, res) => {
  try {
    res.status(200).json(await MenuRepo.edit(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

// DELETE: /menus/1
const deleteMenu = async (req, res) => {
  try {
    res.status(200).json(await MenuRepo.deleteMenu(req.params.id));
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
  }
};

export default {
  getMenus,
  getMenuById,
  createMenu,
  editMenu,
  deleteMenu,
};
