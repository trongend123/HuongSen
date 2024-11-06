import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendConfirmationEmail = async (booking) => {
    // Configure your transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email details
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `quanghieunguyen7a1@gmail.com   `, // assuming booking has customer's email
        subject: 'Booking Confirmation - Your Booking is Confirmed!',
        html: `
            <h2>Dear ${booking.customerName},</h2>
            <p>Thank you for your booking with us! We are excited to confirm your booking.</p>
            <h3>Booking Details:</h3>
            <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Date:</strong> ${booking.date}</li>
                <li><strong>Amount Paid:</strong> $${booking.amount}</li>
            </ul>
            <p>If you have any questions or need further assistance, feel free to contact us at ${process.env.CONTACT_EMAIL}.</p>
            <p>We look forward to providing you with an amazing experience!</p>
            <br>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        `
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
