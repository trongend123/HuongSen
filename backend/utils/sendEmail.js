import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendConfirmationEmail = async (orderRoom) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderRoom.customerId.email, // Send to customer's email
        subject: 'Booking Confirmation - Your Booking is Confirmed!',
        html: `
            <h2>Dear ${orderRoom.customerId.fullname},</h2>
            <p>Thank you for booking with us! Your booking is confirmed.</p>
            <h3>Booking Details:</h3>
            <ul>
                <li><strong>Booking ID:</strong> ${orderRoom._id}</li>
                <li><strong>Quantity:</strong> ${orderRoom.quantity}</li>
                <!-- Add more details if needed -->
            </ul>
            <p>If you have any questions, please contact us at ${process.env.CONTACT_EMAIL}.</p>
            <br>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
