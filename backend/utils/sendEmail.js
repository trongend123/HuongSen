import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendConfirmationEmail = async (booking) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const templatePath = path.join(__dirname, 'emailTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html.replace('{{fullName}}', booking.fullName)
               .replace('{{tourName}}', booking.tourName)
               .replace('{{tourId}}', booking._id)
               .replace('{{adult}}', booking.adult)
               .replace('{{children}}', booking.children)
               .replace('{{baby}}', booking.baby)
               .replace('{{bookAt}}', booking.bookAt)
               .replace('{{price}}', booking.price);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.userEmail,
        subject: 'Booking Confirmation',
        html: html,
    };

    await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
