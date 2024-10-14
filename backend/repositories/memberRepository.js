// // repositories/memberRepository.js

// import Member from '../models/member.js';
// import Booking from '../models/booking.js';

// class MemberRepository {
//     // Tạo member mới
//     async createMember(data) {
//         // Kiểm tra xem Booking có tồn tại không
//         const bookingExists = await Booking.findById(data.bookingid);
//         if (!bookingExists) {
//             throw new Error('Booking không tồn tại');
//         }

//         const member = new Member(data);
//         return await member.save();
//     }

//     // Lấy tất cả members
//     async getAllMembers() {
//         return await Member.find()
//             .populate('bookingid')
//             .exec();
//     }

//     // Lấy member theo ID
//     async getMemberById(id) {
//         return await Member.findById(id)
//             .populate('bookingid')
//             .exec();
//     }

//     // Lấy member theo email
//     async getMemberByEmail(email) {
//         return await Member.findOne({ email }).exec();
//     }

//     // Lấy member theo phone
//     async getMemberByPhone(phone) {
//         return await Member.findOne({ phone }).exec();
//     }

//     // Cập nhật member theo ID
//     async updateMember(id, data) {
//         // Nếu có cập nhật bookingid, kiểm tra xem Booking có tồn tại không
//         if (data.bookingid) {
//             const bookingExists = await Booking.findById(data.bookingid);
//             if (!bookingExists) {
//                 throw new Error('Booking không tồn tại');
//             }
//         }

//         return await Member.findByIdAndUpdate(id, data, { new: true, runValidators: true })
//             .populate('bookingid')
//             .exec();
//     }

//     // Xóa member theo ID
//     async deleteMember(id) {
//         return await Member.findByIdAndDelete(id).exec();
//     }
// }

// export default new MemberRepository();
