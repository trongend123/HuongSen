// import Avatar from "../models/avatar.js";

// // Create Avatar
// const create = async ({ caption, base64 }) => {
//   try {
//     const newAvatar = await Avatar.create({ caption, base64 });
//     return newAvatar._doc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get all avatars
// const list = async () => {
//   try {
//     return await Avatar.find({}).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Get avatar by id
// const getById = async (id) => {
//   try {
//     return await Avatar.findOne({ _id: id }).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Edit avatar
// const edit = async (id, { caption, base64 }) => {
//   try {
//     const updatedAvatar = await Avatar.findByIdAndUpdate(
//       { _id: id },
//       { caption, base64 },
//       { new: true }
//     );

//     if (!updatedAvatar) {
//       throw new Error("Avatar not found");
//     }

//     return updatedAvatar;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// // Delete avatar
// const deleteAvatar = async (id) => {
//   try {
//     return await Avatar.findByIdAndDelete({ _id: id });
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// export default {
//   create,
//   list,
//   getById,
//   edit,
//   deleteAvatar,
// };
