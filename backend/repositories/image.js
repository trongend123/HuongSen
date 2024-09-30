import Image from "../models/image.js";
// Create
const create = async ({
  caption,
  url,
}) => {
  try {
    // Create new image
    const newImage = await Image.create({
      caption,
      url,
    });
    // Return newImage object
    return newImage._doc;
  } catch (error) {
    throw new Error(error.toString());
  }
};
// Get all images
const list = async () => {
  try {
    return await Image.find({}).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const getById = async (id) => {
  try {
    return await Image.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(error.toString());
  }
};

const edit = async (
  id,
  {
    caption,
    url,
  }
) => {
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      { _id: id },
      {
        caption,
        url,
      },
      { new: true }
    );

    if (!updatedImage) {
      throw new Error("Image not found");
    }

    return updatedImage;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const deleteImage = async (id) => {
  try {
    return await Image.findByIdAndDelete({ _id: id });
  } catch (error) {
    throw new Error(error.toString());
  }
};
export default {
  create,
  list,
  getById,
  edit,
  deleteImage,
};
