import express from 'express'
const router = express.Router();
import Booking from './../models/booking.js';

import sendConfirmationEmail from '../utils/sendEmail.js'; 

router.put('/confirm-and-send-email/:id', async (req, res) => {
    const bookingId = req.params.id;

    try {
        // Cập nhật trạng thái booking
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'confirmed' },
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

export default router; 
