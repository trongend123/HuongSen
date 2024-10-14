// // models/Member.js
// import mongoose from 'mongoose';

// const { Schema, model } = mongoose;

// const memberSchema = new Schema(
//   {
//     fullname: {
//       type: String,
//       required: [true, 'Vui lòng nhập họ và tên'],
//       trim: true,
//       minlength: [3, 'Họ và tên phải có ít nhất 3 ký tự'],
//       maxlength: [100, 'Họ và tên không được vượt quá 100 ký tự'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Vui lòng nhập email'],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         'Email không hợp lệ',
//       ],
//     },
//     phone: {
//       type: String,
//       required: [true, 'Vui lòng nhập số điện thoại'],
//       unique: true,
//       trim: true,
//       match: [
//         /^(\+\d{1,3}[- ]?)?\d{10}$/,
//         'Số điện thoại không hợp lệ',
//       ],
//     },
//     dob: {
//       type: Date,
//       required: [true, 'Vui lòng nhập ngày sinh'],
//       validate: {
//         validator: function (value) {
//           // Kiểm tra rằng ngày sinh không phải là ngày tương lai
//           return value < new Date();
//         },
//         message: 'Ngày sinh không hợp lệ',
//       },
//     },
//     gender: {
//       type: String,
//       enum: ['Male', 'Female', 'Other'],
//       required: [false, 'Vui lòng chọn giới tính'],
//     },
//     address: {
//       type: String,
//       required: [true, 'Vui lòng nhập địa chỉ'],
//       trim: true,
//       minlength: [5, 'Địa chỉ phải có ít nhất 5 ký tự'],
//       maxlength: [200, 'Địa chỉ không được vượt quá 200 ký tự'],
//     },
//     bookingid: {
//       type: Schema.Types.ObjectId,
//       ref: 'Booking',
//       required: [true, 'Vui lòng chọn Booking'],
//     },
//   },
//   {
//     timestamps: true, // Tự động thêm createdAt và updatedAt
//   }
// );

// // Tạo index để tăng hiệu suất tìm kiếm
// memberSchema.index({ email: 1 });
// memberSchema.index({ phone: 1 });

// export default model('Members', memberSchema);
