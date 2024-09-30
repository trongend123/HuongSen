import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
    caption: { type: String, required: true },
    base64: { type: String, required: true }  // Dữ liệu hình ảnh được lưu dưới dạng chuỗi Base64
});

const Avatar = mongoose.model('Avatar', avatarSchema);
export default Avatar;
