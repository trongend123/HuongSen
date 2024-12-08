import express from 'express';
import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js';
import Booking from '../models/booking.js';
import OrderRooms from '../models/orderRoom.js';
import OrderServices from '../models/orderService.js';
import sendConfirmationEmail from '../utils/sendEmail.js'; // Import hàm gửi email
import axios from 'axios';
dotenv.config();

const router = express.Router();

const payos = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_CLIENT_SECRET,
    process.env.PAYOS_PRIVATE_KEY
);

router.post('/create-payment-link', async (req, res) => {
    const { amount, bookingId } = req.body;
    const YOUR_DOMAIN = process.env.REACT_URL;

    try {

        const expirationTime = Math.floor(Date.now() / 1000) + 600; // Tính toán thời gian hết hạn trong 10 phút (600 giây)

        const order = {
            amount: amount,
            description: bookingId,
            orderCode: Math.floor(10000000 + Math.random() * 90000000),
            expiredAt: expirationTime,
            returnUrl: `${YOUR_DOMAIN}/success/${bookingId}/${amount}`,
            cancelUrl: `${YOUR_DOMAIN}/cancel/${bookingId}`,
        };
        const bookingIddel = bookingId

        const paymentLink = await payos.createPaymentLink(order);

        // Set a timeout of 5 minutes to delete the booking if payment is not processed
        setTimeout(async () => {
            const response = await axios.get(`http://localhost:9999/bookings/${bookingId}`);
            if (response.data.payment === 0 || response.data.payment === undefined) {
                await axios.delete(`http://localhost:9999/bookings/all/${bookingIddel}`);
                console.log(`Booking ${bookingId} deleted due to timeout.`);
            }
            else {
                console.log(`Booking ${bookingId} not  deleted .`);
            }

        }, 600000); // 10 minutes timeout

        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error(`Error creating payment link: ${bookingId}`, error.message);
        res.status(500).json({ error: 'An error occurred while creating the payment link.' });
    }
});


router.post('/create-payment', async (req, res) => {
    const { amount, bookingId, status } = req.body;

    try {
        const newPayment = new Payment({
            amount,
            bookingId,
            status,
        });

        const savedPayment = await newPayment.save();
        res.status(201).json({
            success: true,
            message: '<h1>Quý khách đã thanh toán thành công</h1>',
            data: savedPayment,
        });
    } catch (error) {
        console.error('Lỗi tạo thanh toán:', error.message);
        res.status(500).json({ success: false, error: 'Có lỗi xảy ra khi tạo thanh toán.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'Đã đặt' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đặt phòng.' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật đặt phòng thành công.', data: updatedBooking });
    } catch (error) {
        console.error("Lỗi xác nhận đặt phòng:", error.message);
        res.status(500).json({ error: 'Có lỗi xảy ra khi xác nhận đặt phòng.' });
    }
});

router.put('/booking/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params; // Get the bookingId from the URL params
        const { amount, status } = req.body; // Get updated payment data from the request body

        // Find the payment document by bookingId
        const payment = await Payment.findOne({ bookingId });

        if (!payment) {
            return res.json({ success: false, payment });
        }

        // Update the payment document
        payment.amount = amount || payment.amount; // Update amount if provided, otherwise keep the old value
        payment.status = status || payment.status; // Update status if provided, otherwise keep the old value
        payment.paymentDate = Date.now(); // Optionally update the payment date when the payment is updated

        // Save the updated payment document
        await payment.save();

        return res.status(200).json({ success: true, payment });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error });
    }
});
// GET route for retrieving Payment based on bookingId
router.get('/booking/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params; // Get the bookingId from the URL params

        // Find the payment document by bookingId
        const payment = await Payment.findOne({ bookingId }); // Populate the bookingId reference if needed

        if (!payment) {
            return res.json({ success: false });
        }

        return res.status(200).json({ success: true, payment });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error });
    }
})

router.get('/payment-success/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
        const orderRooms = await OrderRooms.find({ bookingId })
            .populate('customerId', 'email fullname phone')
            .populate({
                path: 'roomCateId',
                select: 'name numberOfBed numberOfHuman price locationId',
                populate: {
                    path: 'locationId',
                    select: 'name address phone'
                }
            })
            .populate('bookingId', 'status payment checkin checkout note price humans');

        const orderServices = await OrderServices.find({ bookingId }).populate('otherServiceId', 'name price');

        if (!orderRooms || orderRooms.length === 0) {
            console.error("Không tìm thấy phòng đặt nào cho mã đặt phòng:", bookingId);
            return res.status(500).send('<h4>Không tìm thấy phòng đặt liên quan đến mã đặt phòng này.</h4>');
        }

        const invalidOrderRooms = orderRooms.filter(orderRoom =>
            !orderRoom.customerId || !orderRoom.roomCateId || !orderRoom.roomCateId.locationId
        );

        if (invalidOrderRooms.length > 0) {
            console.error("Một số phòng đặt thiếu thông tin:", invalidOrderRooms);
            return res.status(500).send('<h1>Một số thông tin phòng đặt bị thiếu.</h1>');
        }

        await sendConfirmationEmail(orderRooms, orderServices);

        res.send('<p>Đơn đặt của bạn đã được xác nhận và thông tin đã được gửi qua email.</p>');
    } catch (error) {
        console.error("Lỗi xác nhận đặt phòng và gửi email:", error.message);
        res.status(500).send('<h1>Có lỗi xảy ra khi xác nhận đặt phòng và gửi email xác nhận.</h1>');
    }
});

// Xử lý hủy thanh toán
router.get('/payment-cancel/:id', (req, res) => {
    res.send('<h1>Hủy thanh toán</h1><p>Đặt phòng của bạn chưa được xác nhận.</p>');
});

export default router;
