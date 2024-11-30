import express from 'express'
const router = express.Router();
import Booking from './../models/booking.js';
import OrderRooms from './../models/orderRoom.js';
import { sendOtpEmail, verifyOtp } from '../utils/otpVerification.js.js'; // Import OTP functions
import sendConfirmationEmail from '../utils/sendEmail.js';

router.put('/confirm-and-send-email/:id', async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Cập nhật trạng thái booking
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'Đã đặt' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Gửi email xác nhận
        await sendConfirmationEmail(booking);
        
        res.json({ success: true, data: booking });
    } catch (error) {
        console.error('Error confirming booking and sending email:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Route gửi OTP tới email của khách hàng
router.post('/send-otp/:id', async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Tìm OrderRoom có bookingId tương ứng và populate customerId để lấy thông tin khách hàng
        const orderRoom = await OrderRooms.findOne({ bookingId: bookingId })
            .populate('customerId'); // Populate để lấy thông tin customerId (email)

        if (!orderRoom) {
            return res.status(404).json({ success: false, message: 'OrderRoom not found for this bookingId' });
        }

        // Gửi OTP tới email của khách hàng
        await sendOtpEmail(orderRoom.customerId.email);

        // Trả về thông báo thành công
        res.json({ success: true, message: 'OTP sent successfully to ' + orderRoom.customerId.email });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Route xác minh OTP và cho phép tiếp tục nếu OTP đúng
router.post('/verify-otp/:id', async (req, res) => {
    const bookingId = req.params.id;
    const { otp } = req.body; // Lấy OTP từ body của request

    try {
        // Tìm OrderRoom có bookingId tương ứng và populate customerId để lấy thông tin khách hàng
        const orderRoom = await OrderRooms.findOne({ bookingId: bookingId })
            .populate('customerId'); // Populate để lấy thông tin customerId (email)

        if (!orderRoom) {
            return res.status(404).json({ success: false, message: 'OrderRoom not found for this bookingId' });
        }

        // Sử dụng hàm verifyOtp để kiểm tra OTP
        const isOtpValid = verifyOtp(orderRoom.customerId.email, otp);

        // Nếu OTP hợp lệ, tiếp tục xử lý và trả về thông báo thành công
        if (isOtpValid) {
            // Có thể tiếp tục các thao tác khác sau khi xác thực OTP
            // Ví dụ: Cập nhật booking, thực hiện thanh toán, gửi email xác nhận, v.v.
            res.json({ success: true, message: 'OTP is valid. You may proceed with your request.' });
        } else {
            // Nếu OTP không hợp lệ, không cho phép tiếp tục
            res.json({ success: false, message: 'Invalid or expired OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


export default router; 
