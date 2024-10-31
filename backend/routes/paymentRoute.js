import express from 'express';
import PayOS from '@payos/node';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js'; // Adjust the path according to your directory structure
import Booking from '../models/booking.js';
dotenv.config();

const router = express.Router();

const payos = new PayOS(
    "bf5f0eaf-610c-44c0-b622-f77ccd209389",
    "48038d7f-c9ec-44f5-9133-453065493a6a",
    "668615efa053dfcafba201e6710972b9c98adf34776b52d25461eb67c6de352d"
);

router.post('/create-payment-link', async (req, res) => {
    const { amount, bookingId } = req.body;
    const YOUR_DOMAIN = process.env.REACT_URL;

    try {
        const order = {
            amount: amount * 10,
            description: bookingId, // Example description
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

// Route to handle payment success
router.get('/payment-success/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: { status: 'confirmed' } },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).send('<h1>Booking not found</h1>');
        }

        res.send('<h1>Payment successful!</h1><p>Your booking has been confirmed.</p>');
    } catch (error) {
        console.error("Error confirming booking:", error.message);
        res.status(500).send('<h1>An error occurred while confirming your booking</h1>');
    }
});

// Route to handle payment cancellation
router.get('/payment-cancel/:id', (req, res) => {
    res.send('<h1>Payment cancelled</h1><p>Your booking has not been confirmed.</p>');
});

export default router;
