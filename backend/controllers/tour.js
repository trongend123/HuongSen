// import { TourRepo } from "../repositories/index.js";
// // GET: /tours
// const getTours = async (req, res) => {
//   try {
//     res.status(200).json(await TourRepo.list());
//   } catch (error) {
//     res.status(500).json({
//       message: error.toString(),
//     });
//   }
// };

// // GET: /tours/1
// const getTourById = async (req, res) => {
//   try {
//     res.status(200).json(await TourRepo.getById(req.params.id));
//   } catch (error) {
//     res.status(500).json({
//       message: error.toString(),
//     });
//   }
// };

// // POST: /tours
// const createTour = async (req, res) => {
//   try {
//     // Get object from request body

//     const {
//         name,
//         description,
//         price,
//         image,
//     } = req.body;
//     const newTour = await TourRepo.create({
//         name,
//         description,
//         price,
//         image,
//     });
//     res.status(201).json(newTour);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // PUT: /tours/1
// const editTour = async (req, res) => {
//   try {
//     res.status(200).json(await TourRepo.edit(req.params.id, req.body));
//   } catch (error) {
//     res.status(500).json({
//       error: error.toString(),
//     });
//   }
// };

// // DELETE: /tours/1
// const deleteTour = async (req, res) => {
//   try {
//     res.status(200).json(await TourRepo.deleteTour(req.params.id));
//   } catch (error) {
//     res.status(500).json({
//       error: error.toString(),
//     });
//   }
// };

// export default {
//   getTours,
//   getTourById,
//   createTour,
//   editTour,
//   deleteTour,
// };
