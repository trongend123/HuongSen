import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { format } from 'date-fns';

dotenv.config();

const sendConfirmationEmail = async (orderRooms, orderServices) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Kiểm tra và xử lý giá trị ngày tháng
    const formatDate = (dateValue) => {
        try {
            return format(new Date(dateValue), 'dd-MM-yyyy');
        } catch (error) {
            console.warn('Invalid date value:', dateValue);
            return 'Không xác định'; // Giá trị mặc định nếu ngày không hợp lệ
        }
    };

    const formatDateHour = (dateValue) => {
        try {
            const date = new Date(dateValue);
            date.setHours(date.getHours() - 7); // Trừ 7 giờ
            return format(date, 'dd-MM-yyyy HH:mm'); // Định dạng ngày/tháng/năm và giờ:phút
        } catch (error) {
            console.warn('Invalid date value:', dateValue);
            return 'Không xác định';
        }
    };

    // Tạo danh sách thông tin chi tiết từng phòng
    const roomsDetails = orderRooms.map((room) => `

  <ul>
      <li><strong>Loại phòng:</strong> ${room.roomCateId?.name || 'Không xác định'}</li>
      <li><strong>Số giường:</strong> ${room.roomCateId?.numberOfBed || 'Không xác định'}</li>
      <li><strong>Giá phòng:</strong> ${room.roomCateId?.price?.toLocaleString() || '0'} VND / đêm</li>
      <li><strong>Số lượng phòng:</strong> ${room.quantity || 'Không xác định'}</li>
      <li><strong>Số lượng người:</strong> ${room.bookingId?.humans || 'Không xác định'}</li>
      <li><strong>Ngày nhận phòng:</strong> ${formatDate(room.receiveRoom)}</li>
      <li><strong>Ngày trả phòng:</strong> ${formatDate(room.returnRoom)}</li>
  </ul>
`).join('');

    // Tạo danh sách thông tin chi tiết từng dịch vụ
    const serviceDetails = orderServices.map((service) => ` 
  <ul>
      <li><strong>Loại dịch vụ:</strong> ${service.otherServiceId?.name || 'Không xác định'}</li>
      <li><strong>Giá dịch vụ:</strong> ${service.otherServiceId?.price || 'Không xác định'}</li>
      <li><strong>Đơn Vị:</strong> ${service.quantity || 'Không xác định'}</li>
      <li><strong>Thời gian sử dụng:</strong> ${formatDateHour(service.time)}</li>
      <li><strong>Ghi chú:</strong> ${service.note || ''}</li>

  </ul>
`).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderRooms[0].customerId.email,
        subject: 'Xác nhận đặt phòng - Đặt phòng của bạn đã được xác nhận!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Kính chào ${orderRooms[0].customerId.fullname},</h2>
                <p>Cảm ơn bạn đã đặt phòng với chúng tôi! Chúng tôi rất vui được thông báo rằng đặt phòng của bạn đã được xác nhận.</p>

                <h3>Thông tin đặt phòng:</h3>
                <ul>
                    <li><strong>Mã Đặt Phòng:</strong> ${orderRooms[0].bookingId._id}</li>
                    <li><strong>Hình thức thanh toán:</strong> Chuyển khoản</li>
                    
                    <li><strong>Ghi chú:</strong> ${orderRooms[0].bookingId.note || 'Không có ghi chú'}</li>
                    <li><strong>Tổng giá:</strong> ${orderRooms[0].bookingId.price} VND</li>
                </ul>

                <h3>Thông tin khách hàng:</h3>
                <ul>
                    <li><strong>Họ tên:</strong> ${orderRooms[0].customerId.fullname}</li>
                    <li><strong>Email:</strong> ${orderRooms[0].customerId.email}</li>
                    <li><strong>Số điện thoại:</strong> ${orderRooms[0].customerId.phone}</li>
                </ul>

                <h3>Thông tin phòng:</h3>
                 ${roomsDetails}

                <h3>Thông tin dịch vụ</h3>
                 ${serviceDetails}

                <h3>Địa điểm:</h3>
                <ul>
                    <li><strong>Tên địa điểm:</strong> ${orderRooms[0].roomCateId.locationId.name}</li>
                    <li><strong>Địa chỉ:</strong> ${orderRooms[0].roomCateId.locationId.address}</li>
                    <li><strong>Số điện thoại liên hệ:</strong> ${orderRooms[0].roomCateId.locationId.phone}</li>
                </ul>

                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: nhakhachhuongsen.business@gmail.com hoặc số điện thoại của địa điểm trên.</p>
                <br>
                <p>Trân trọng,</p>
                <p>Đội Ngũ Nhà Khách Hương Sen</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;