import express from 'express';
import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js'; // Adjust the path according to your directory structure
import Booking from '../models/booking.js';
import OrderRooms from '../models/orderRoom.js';
import sendConfirmationEmail from '../utils/sendEmail.js'; // Import the email function
dotenv.config();

const router = express.Router();
const payos = new PayOS(
    "bf5f0eaf-610c-44c0-b622-f77ccd209389",
    "48038d7f-c9ec-44f5-9133-453065493a6a",
    "668615efa053dfcafba201e6710972b9c98adf34776b52d25461eb67c6de352d");

router.post('/create-payment-link', async (req, res) => {
    const { amount, bookingId } = req.body;
    const YOUR_DOMAIN = process.env.REACT_URL;

    try {
        const order = {
            amount: amount,
            description: bookingId,
            orderCode: Math.floor(10000000 + Math.random() * 90000000),
            returnUrl: `${YOUR_DOMAIN}/success`,
            cancelUrl: `${YOUR_DOMAIN}/cancel`,
        };

        const paymentLink = await payos.createPaymentLink(order);

        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error("Error creating payment link:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'confirmed' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
    } catch (error) {
        console.error("Error confirming booking:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get('/payment-success/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Fetch the booking and populate necessary details
        const orderRoom = await OrderRooms.findById(id)
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
        
        // Check if all necessary data is present
        if (!orderRoom || !orderRoom.customerId || !orderRoom.roomCateId || !orderRoom.roomCateId.locationId) {
            console.error("Order room or necessary fields missing:", orderRoom);
            return res.status(500).send('<h1>Required booking details are missing.</h1>');
        }

        // Send confirmation email
        await sendConfirmationEmail(orderRoom);

        res.send('<h1>Payment successful!</h1><p>Your booking has been confirmed, and a confirmation email has been sent.</p>');
    } catch (error) {
        console.error("Error confirming booking and sending email:", error.message);
        res.status(500).send('<h1>An error occurred while confirming your booking and sending the confirmation email</h1>');
    }
});


// Route to handle payment cancellation
router.get('/payment-cancel/:id', (req, res) => {
    res.send('<h1>Payment cancelled</h1><p>Your booking has not been confirmed.</p>');
});

export default router;