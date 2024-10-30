import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', // Reference to the Booking model if you have one
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'cancel', 'confirm'],
        default: 'pending',
    },
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
