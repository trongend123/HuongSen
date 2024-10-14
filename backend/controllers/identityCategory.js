// import { IdentityCategoryRepo } from "../repositories/index.js";

// // GET: /identity-categories
// const getIdentityCategories = async (req, res) => {
//     try {
//         const categories = await IdentityCategoryRepo.list();
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // GET: /identity-categories/:id
// const getIdentityCategoryById = async (req, res) => {
//     try {
//         const category = await IdentityCategoryRepo.getById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ message: "Identity Category not found" });
//         }
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // POST: /identity-categories
// const createIdentityCategory = async (req, res) => {
//     try {
//         const { name, description } = req.body;

//         const newCategory = await IdentityCategoryRepo.create({
//             name,
//             description,
//         });

//         res.status(201).json(newCategory);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // PUT: /identity-categories/:id
// const editIdentityCategory = async (req, res) => {
//     try {
//         const updatedCategory = await IdentityCategoryRepo.edit(
//             req.params.id,
//             req.body
//         );
//         if (!updatedCategory) {
//             return res.status(404).json({ message: "Identity Category not found" });
//         }
//         res.status(200).json(updatedCategory);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // DELETE: /identity-categories/:id
// const deleteIdentityCategory = async (req, res) => {
//     try {
//         const deletedCategory = await IdentityCategoryRepo.deleteCategory(
//             req.params.id
//         );
//         if (!deletedCategory) {
//             return res.status(404).json({ message: "Identity Category not found" });
//         }
//         res.status(200).json(deletedCategory);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// export default {
//     getIdentityCategories,
//     getIdentityCategoryById,
//     createIdentityCategory,
//     editIdentityCategory,
//     deleteIdentityCategory,
// };
