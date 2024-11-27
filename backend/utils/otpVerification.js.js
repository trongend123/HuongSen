import crypto from 'crypto'; // Để tạo OTP ngẫu nhiên
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Đối tượng lưu trữ OTP tạm thời và thời gian gửi OTP
let otpStore = {};

// Hàm tạo OTP ngẫu nhiên
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); // Tạo OTP 6 chữ số
};

// Hàm gửi OTP
const sendOtpEmail = async (email) => {
    const otp = generateOtp(); // Tạo OTP mới

    // Lưu OTP vào bộ nhớ tạm thời, kèm theo thời gian gửi
    otpStore[email] = {
        otp,
        sentAt: Date.now() // Lưu thời gian gửi OTP
    };

    // Gửi email OTP (Sử dụng nodemailer hoặc phương thức gửi email khác)
    await sendOtpEmailService(email, otp); // Gọi hàm sendOtpEmailService ở bước trước

    console.log(`OTP sent to ${email}: ${otp}`);
};

// Hàm xác minh OTP
const verifyOtp = (email, otp) => {
    const otpData = otpStore[email];

    // Nếu không tìm thấy OTP cho email hoặc OTP đã hết hạn
    if (!otpData || Date.now() - otpData.sentAt > 5 * 60 * 1000) {
        return false; // OTP đã hết hạn hoặc không tồn tại
    }

    // Kiểm tra OTP có khớp không
    if (otpData.otp !== otp) {
        return false; // OTP không đúng
    }

    // Nếu OTP hợp lệ, xóa OTP khỏi bộ nhớ (để không lưu trữ lâu dài)
    delete otpStore[email];

    return true; // OTP hợp lệ
};

// Hàm gửi OTP (bạn có thể sử dụng nodemailer như trong các ví dụ trước)
const sendOtpEmailService = async (email, otp) => {
    // Cấu hình gửi email (ví dụ với nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác thực OTP của bạn',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Xin chào,</h2>
                <p>Bạn đã yêu cầu mã xác thực (OTP) cho việc xác minh tài khoản của mình.</p>

                <h3>Mã OTP của bạn:</h3>
                <p style="font-size: 20px; font-weight: bold; color: #d9534f;">${otp}</p>

                <p>Vui lòng nhập mã này để hoàn tất quá trình xác minh. Mã OTP này có hiệu lực trong vòng 5 phút.</p>

                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.</p>

                <br>
                <p>Trân trọng,</p>
                <p>Đội ngũ Nhà Khách Hương Sen</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
};

export { sendOtpEmail, verifyOtp };
