// // controllers/memberController.js

// import memberRepository from '../repositories/memberRepository.js';

// class MemberController {
//     // Tạo member mới
//     async createMember(req, res) {
//         try {
//             const data = req.body;

//             // Kiểm tra email và phone đã tồn tại chưa
//             const existingEmail = await memberRepository.getMemberByEmail(data.email);
//             if (existingEmail) {
//                 return res.status(400).json({ message: 'Email đã được sử dụng' });
//             }

//             const existingPhone = await memberRepository.getMemberByPhone(data.phone);
//             if (existingPhone) {
//                 return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
//             }

//             const member = await memberRepository.createMember(data);
//             res.status(201).json(member);
//         } catch (error) {
//             console.error('Error creating member:', error);
//             if (error.name === 'ValidationError') {
//                 return res.status(400).json({ message: error.message });
//             }
//             if (error.message === 'Booking không tồn tại') {
//                 return res.status(400).json({ message: error.message });
//             }
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }

//     // Lấy tất cả members
//     async getAllMembers(req, res) {
//         try {
//             const members = await memberRepository.getAllMembers();
//             res.status(200).json(members);
//         } catch (error) {
//             console.error('Error fetching members:', error);
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }

//     // Lấy member theo ID
//     async getMemberById(req, res) {
//         try {
//             const { id } = req.params;
//             const member = await memberRepository.getMemberById(id);
//             if (!member) {
//                 return res.status(404).json({ message: 'Member không tồn tại' });
//             }
//             res.status(200).json(member);
//         } catch (error) {
//             console.error('Error fetching member:', error);
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }

//     // Cập nhật member theo ID
//     async updateMember(req, res) {
//         try {
//             const { id } = req.params;
//             const data = req.body;

//             // Nếu cập nhật email, kiểm tra xem email đã tồn tại chưa
//             if (data.email) {
//                 const existingEmail = await memberRepository.getMemberByEmail(data.email);
//                 if (existingEmail && existingEmail._id.toString() !== id) {
//                     return res.status(400).json({ message: 'Email đã được sử dụng' });
//                 }
//             }

//             // Nếu cập nhật phone, kiểm tra xem phone đã tồn tại chưa
//             if (data.phone) {
//                 const existingPhone = await memberRepository.getMemberByPhone(data.phone);
//                 if (existingPhone && existingPhone._id.toString() !== id) {
//                     return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
//                 }
//             }

//             const updatedMember = await memberRepository.updateMember(id, data);
//             if (!updatedMember) {
//                 return res.status(404).json({ message: 'Member không tồn tại' });
//             }
//             res.status(200).json(updatedMember);
//         } catch (error) {
//             console.error('Error updating member:', error);
//             if (error.name === 'ValidationError') {
//                 return res.status(400).json({ message: error.message });
//             }
//             if (error.message === 'Booking không tồn tại') {
//                 return res.status(400).json({ message: error.message });
//             }
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }

//     // Xóa member theo ID
//     async deleteMember(req, res) {
//         try {
//             const { id } = req.params;
//             const deletedMember = await memberRepository.deleteMember(id);
//             if (!deletedMember) {
//                 return res.status(404).json({ message: 'Member không tồn tại' });
//             }
//             res.status(200).json({ message: 'Member đã được xóa thành công' });
//         } catch (error) {
//             console.error('Error deleting member:', error);
//             res.status(500).json({ message: 'Internal Server Error' });
//         }
//     }
// }

// export default new MemberController();
