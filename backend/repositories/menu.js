import Menu from "../models/menu.js";
// Create
const create = async ({
  foodName,
  drinkName,
  price,
  description,
}) => {
  try {
    // Create new menu
    const newMenu = await Menu.create({
      foodName,
      drinkName,
      price,
      description,
    });
    // Return newMenu object
    return newMenu._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all menus
const list = async () => {
  try {
    return await Menu.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await Menu.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    foodName,
    drinkName,
    price,
    description,
  }
) => {
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      { _id: id },
      {
        foodName,
        drinkName,
        price,
        description,
      },
      { new: true }
    );

    if (!updatedMenu) {
      throw new Error("Menu not found");
    }

    return updatedMenu;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteMenu = async (id) => {
  try {
    return await Menu.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  create,
  list,
  getById,
  edit,
  deleteMenu,
};
