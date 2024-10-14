// import Tour from "../models/tour.js";
// // Create
// const create = async ({
//   name,
//   description,
//   price,
//   image,
// }) => {
//   try {
//     // Create new tour
//     const newTour = await Tour.create({
//       name,
//       description,
//       price,
//       image,
//     });
//     // Return newTour object
//     return newTour._doc;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };
// // Get all tours
// const list = async () => {
//   try {
//     return await Tour.find({}).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// const getById = async (id) => {
//   try {
//     return await Tour.findOne({ _id: id }).exec();
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// const edit = async (
//   id,
//   {
//     name,
//     description,
//     price,
//     image,
//   }
// ) => {
//   try {
//     const updatedTour = await Tour.findByIdAndUpdate(
//       { _id: id },
//       {
//         name,
//         description,
//         price,
//         image,
//       },
//       { new: true }
//     );

//     if (!updatedTour) {
//       throw new Error("Tour not found");
//     }

//     return updatedTour;
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };

// const deleteTour = async (id) => {
//   try {
//     return await Tour.findByIdAndDelete({ _id: id });
//   } catch (error) {
//     throw new Error(error.toString());
//   }
// };
// export default {
//   create,
//   list,
//   getById,
//   edit,
//   deleteTour,
// };
