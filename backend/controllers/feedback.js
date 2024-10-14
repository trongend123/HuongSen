// import { FeedbackRepo } from "../repositories/index.js";

// // GET: /feedbacks
// const getFeedbacks = async (req, res) => {
//     try {
//         const feedbacks = await FeedbackRepo.list();
//         res.status(200).json(feedbacks);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // GET: /feedbacks/:id
// const getFeedbackById = async (req, res) => {
//     try {
//         const feedback = await FeedbackRepo.getById(req.params.id);
//         if (!feedback) {
//             return res.status(404).json({ message: "Feedback not found" });
//         }
//         res.status(200).json(feedback);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // POST: /feedbacks
// const createFeedback = async (req, res) => {
//     try {
//         // Lấy dữ liệu từ request body
//         const { locationId, customerId, content } = req.body;

//         const newFeedback = await FeedbackRepo.create({
//             locationId,
//             customerId,
//             content,
//         });

//         res.status(201).json(newFeedback);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // PUT: /feedbacks/:id
// const editFeedback = async (req, res) => {
//     try {
//         const updatedFeedback = await FeedbackRepo.edit(req.params.id, req.body);
//         if (!updatedFeedback) {
//             return res.status(404).json({ message: "Feedback not found" });
//         }
//         res.status(200).json(updatedFeedback);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// // DELETE: /feedbacks/:id
// const deleteFeedback = async (req, res) => {
//     try {
//         const deletedFeedback = await FeedbackRepo.deleteFeedback(req.params.id);
//         if (!deletedFeedback) {
//             return res.status(404).json({ message: "Feedback not found" });
//         }
//         res.status(200).json(deletedFeedback);
//     } catch (error) {
//         res.status(500).json({
//             message: error.toString(),
//         });
//     }
// };

// export default {
//     getFeedbacks,
//     getFeedbackById,
//     createFeedback,
//     editFeedback,
//     deleteFeedback,
// };
