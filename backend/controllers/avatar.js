// import Avatar from "../models/avatar.js";

// // GET: /avatars
// const getAvatars = async (req, res) => {
//   try {
//     res.status(200).json(await Avatar.find());
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // GET: /avatars/:id
// const getAvatarById = async (req, res) => {
//   try {
//     const avatar = await Avatar.findById(req.params.id);
//     res.status(200).json(avatar);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // POST: /avatars
// const createAvatar = async (req, res) => {
//   try {
//     const { caption, base64 } = req.body;
//     const newAvatar = await Avatar.create({ caption, base64 });
//     res.status(201).json(newAvatar);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // PUT: /avatars/:id
// const editAvatar = async (req, res) => {
//   try {
//     const updatedAvatar = await Avatar.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedAvatar);
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// // DELETE: /avatars/:id
// const deleteAvatar = async (req, res) => {
//   try {
//     await Avatar.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Avatar deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.toString() });
//   }
// };

// export default {
//   getAvatars,
//   getAvatarById,
//   createAvatar,
//   editAvatar,
//   deleteAvatar,
// };
