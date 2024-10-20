import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';

const UpdateBookingInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedBookingDetails } = location.state || {}; // Lấy dữ liệu đã truyền

    // State để lưu thông tin booking và số lượng
    const [bookingDetails, setBookingDetails] = useState({
        quantity: selectedBookingDetails?.quantity || 0,
        checkout: selectedBookingDetails?.bookingId?.checkout || '',
        roomCateId: selectedBookingDetails?.roomCateId,
    });

    // Cập nhật state khi selectedBookingDetails thay đổi
    useEffect(() => {
        if (selectedBookingDetails) {
            setBookingDetails({
                quantity: selectedBookingDetails.quantity,
                checkout: selectedBookingDetails.bookingId.checkout,
                roomCateId: selectedBookingDetails.roomCateId,
            });
        }
    }, [selectedBookingDetails]);

    // Xử lý thay đổi thông tin số lượng
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Xử lý gửi thông tin đã cập nhật
    const handleSubmit = (e) => {
        e.preventDefault();

        // Bạn có thể gửi yêu cầu cập nhật đến API ở đây
        console.log("Updated Booking Details:", bookingDetails);

        // Sau khi gửi yêu cầu thành công
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <Container>
            <h2>Cập nhật thông tin đặt phòng</h2>
            {selectedBookingDetails ? (
                <Form onSubmit={handleSubmit}>
                    <h5>Thông tin khách hàng</h5>
                    <p><strong>Tên Khách:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.fullname : 'Không có'}</p>
                    <p><strong>Điện thoại:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.phone : 'Không có'}</p>
                    <p><strong>Email:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.email : 'Không có'}</p>
                    <p><strong>Ngày sinh:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.dob : 'Không có'}</p>

                    <h5>Thông tin xác thực</h5>
                    <p><strong>Tên xác thực:</strong> {selectedBookingDetails.identifyName ? selectedBookingDetails.identifyName : 'Không có'}</p>
                    <p><strong>Mã xác thực:</strong> {selectedBookingDetails.identifyCode ? selectedBookingDetails.identifyCode : 'Không có'}</p>

                    <h5>Thông tin đặt phòng</h5>
                    <Form.Group controlId="quantity">
                        <Form.Label>Số lượng phòng</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={bookingDetails.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />
                    </Form.Group>
                    <p><strong>Ngày Checkin:</strong> {selectedBookingDetails.bookingId.checkin}</p>

                    <Form.Group controlId="checkout">
                        <Form.Label>Ngày Checkout</Form.Label>
                        <Form.Control
                            type="date"
                            name="checkout"
                            value={bookingDetails.checkout.split('T')[0]} // Chuyển đổi định dạng ngày
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <p><strong>Tên phòng:</strong> {bookingDetails.roomCateId ? bookingDetails.roomCateId.name : 'Không có'}</p>
                    <p><strong>Giá:</strong> {bookingDetails.roomCateId ? bookingDetails.roomCateId.price : 0}</p>
                    <p><strong>Tổng giá:</strong> {(bookingDetails.quantity * (bookingDetails.roomCateId ? bookingDetails.roomCateId.price : 0)).toFixed(2)}</p>

                    <Button variant="primary" type="submit">
                        Cập nhật thông tin
                    </Button>
                </Form>
            ) : (
                <p>Không có thông tin để cập nhật.</p>
            )}
        </Container>
    );
};

export default UpdateBookingInfo;
