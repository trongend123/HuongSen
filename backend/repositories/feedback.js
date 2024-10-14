// import Feedback from "../models/feedback.js";

// // Create a new feedback
// const create = async ({ locationId, customerId, content }) => {
//     try {
//         const newFeedback = await Feedback.create({
//             locationId,
//             customerId,
//             content,
//         });
//         return newFeedback._doc;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get all feedbacks
// const list = async () => {
//     try {
//         return await Feedback.find({})
//             .populate("locationId")
//             .populate("customerId")
//             .exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get a feedback by ID
// const getById = async (id) => {
//     try {
//         return await Feedback.findOne({ _id: id })
//             .populate("locationId")
//             .populate("customerId")
//             .exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Update a feedback by ID
// const edit = async (id, { locationId, customerId, content }) => {
//     try {
//         const updatedFeedback = await Feedback.findByIdAndUpdate(
//             { _id: id },
//             {
//                 locationId,
//                 customerId,
//                 content,
//             },
//             { new: true }
//         );

//         if (!updatedFeedback) {
//             throw new Error("Feedback not found");
//         }

//         return updatedFeedback;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Delete a feedback by ID
// const deleteFeedback = async (id) => {
//     try {
//         return await Feedback.findByIdAndDelete({ _id: id });
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };


// export default {
//     create,
//     list,
//     getById,
//     edit,
//     deleteFeedback,
// };
