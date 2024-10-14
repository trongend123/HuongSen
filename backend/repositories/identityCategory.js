// import IdentityCategory from "../models/identityCategory.js";

// // Create a new identity category
// const create = async ({ name, description }) => {
//     try {
//         const newCategory = await IdentityCategory.create({
//             name,
//             description,
//         });
//         return newCategory._doc;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get all identity categories
// const list = async () => {
//     try {
//         return await IdentityCategory.find({}).exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get an identity category by ID
// const getById = async (id) => {
//     try {
//         return await IdentityCategory.findOne({ _id: id }).exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Update an identity category by ID
// const edit = async (id, { name, description }) => {
//     try {
//         const updatedCategory = await IdentityCategory.findByIdAndUpdate(
//             { _id: id },
//             {
//                 name,
//                 description,
//             },
//             { new: true }
//         );

//         if (!updatedCategory) {
//             throw new Error("Identity Category not found");
//         }

//         return updatedCategory;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Delete an identity category by ID
// const deleteCategory = async (id) => {
//     try {
//         return await IdentityCategory.findByIdAndDelete({ _id: id });
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// export default {
//     create,
//     list,
//     getById,
//     edit,
//     deleteCategory,
// };
