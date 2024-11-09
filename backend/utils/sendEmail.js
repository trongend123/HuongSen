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
        to: orderRoom.customerId.email,
        subject: 'Xác nhận đặt phòng - Đặt phòng của bạn đã được xác nhận!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Kính chào ${orderRoom.customerId.fullname},</h2>
                <p>Cảm ơn bạn đã đặt phòng với chúng tôi! Chúng tôi rất vui được thông báo rằng đặt phòng của bạn đã được xác nhận.</p>

                <h3>Thông tin đặt phòng:</h3>
                <ul>
                    <li><strong>Mã Đặt Phòng:</strong> ${orderRoom._id}</li>
                    <li><strong>Hình thức thanh toán:</strong> Chuyển khoản</li>
                    <li><strong>Ngày nhận phòng:</strong> ${new Date(orderRoom.bookingId.checkin).toLocaleDateString()}</li>
                    <li><strong>Ngày trả phòng:</strong> ${new Date(orderRoom.bookingId.checkout).toLocaleDateString()}</li>
                    <li><strong>Ghi chú:</strong> ${orderRoom.bookingId.note || 'Không có ghi chú'}</li>
                    <li><strong>Tổng giá:</strong> ${orderRoom.bookingId.price} VND</li>
                </ul>

                <h3>Thông tin khách hàng:</h3>
                <ul>
                    <li><strong>Họ tên:</strong> ${orderRoom.customerId.fullname}</li>
                    <li><strong>Email:</strong> ${orderRoom.customerId.email}</li>
                    <li><strong>Số điện thoại:</strong> ${orderRoom.customerId.phone}</li>
                </ul>

                <h3>Thông tin phòng:</h3>
                <ul>
                    <li><strong>Loại phòng:</strong> ${orderRoom.roomCateId.name}</li>
                    <li><strong>Số giường:</strong> ${orderRoom.roomCateId.numberOfBed}</li>
                    <li><strong>Giá phòng:</strong> ${orderRoom.roomCateId.price} VND / đêm</li>
                    <li><strong>Số lượng phòng:</strong> ${orderRoom.quantity}</li>
                    <li><strong>Số lượng người:</strong> ${orderRoom.bookingId.humans}</li>
                </ul>

                <h3>Địa điểm:</h3>
                <ul>
                    <li><strong>Tên địa điểm:</strong> ${orderRoom.roomCateId.locationId.name}</li>
                    <li><strong>Địa chỉ:</strong> ${orderRoom.roomCateId.locationId.address}</li>
                    <li><strong>Số điện thoại liên hệ:</strong> ${orderRoom.roomCateId.locationId.phone}</li>
                </ul>

                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: nhakhachhuongsen.business@gmail.com hoặc số điện thoại của địa điểm trên.</p>
                <br>
                <p>Trân trọng,</p>
                <p>Đội ngũ ${process.env.COMPANY_NAME || 'Your Company Name'}</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
