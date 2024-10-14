// import Member from "../models/member.js";

// // Create a new member
// const create = async ({
//     fullname,
//     email,
//     phone,
//     dob,
//     gender,
//     address,
//     bookingId,
// }) => {
//     try {
//         const newMember = await Member.create({
//             fullname,
//             email,
//             phone,
//             dob,
//             gender,
//             address,
//             bookingId,
//         });
//         return newMember._doc;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get all members
// const list = async () => {
//     try {
//         return await Member.find({}).populate("bookingId").exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Get a member by ID
// const getById = async (id) => {
//     try {
//         return await Member.findOne({ _id: id }).populate("bookingId").exec();
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Update a member by ID
// const edit = async (
//     id,
//     { fullname, email, phone, dob, gender, address, bookingId }
// ) => {
//     try {
//         const updatedMember = await Member.findByIdAndUpdate(
//             { _id: id },
//             {
//                 fullname,
//                 email,
//                 phone,
//                 dob,
//                 gender,
//                 address,
//                 bookingId,
//             },
//             { new: true }
//         );

//         if (!updatedMember) {
//             throw new Error("Member not found");
//         }

//         return updatedMember;
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// // Delete a member by ID
// const deleteMember = async (id) => {
//     try {
//         return await Member.findByIdAndDelete({ _id: id });
//     } catch (error) {
//         throw new Error(error.toString());
//     }
// };

// export default {
//     create,
//     list,
//     getById,
//     edit,
//     deleteMember,
// };
