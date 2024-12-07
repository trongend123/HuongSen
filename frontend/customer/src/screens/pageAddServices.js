import { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

import axios from 'axios';
import UpdateAndRefund from '../components/UpdateAndRefund';

const PageAddServices = () => {
    const [bookingId, setBookingId] = useState('');
    const [submittedBookingId, setSubmittedBookingId] = useState(null);
    const [isValidBooking, setIsValidBooking] = useState(null);
    const [error, setError] = useState(null);

    const [otp, setOtp] = useState(''); // OTP input
    const [isOtpSent, setIsOtpSent] = useState(false); // OTP sent status
    const [isOtpValid, setIsOtpValid] = useState(false); // OTP valid status
    const [otpError, setOtpError] = useState(null); // OTP error message
    const [isOtpSending, setIsOtpSending] = useState(false)

    const addServiceRef = useRef(null);

    // Theo dõi sự thay đổi của bookingId và kiểm tra nếu Booking ID đã thay đổi
    useEffect(() => {
        if (submittedBookingId !== null && bookingId !== submittedBookingId) {
            // Nếu Booking ID đã thay đổi, reset OTP và gửi lại OTP
            setIsOtpValid(false);
            setIsOtpSent(false);
            setOtp('');
            setOtpError(null);
        }
    }, [bookingId, submittedBookingId]);

    // Handle form submission to validate and set the bookingId
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate Booking ID
        const bookingIdRegex = /^[a-zA-Z0-9]+$/; // Alphanumeric only
        if (!bookingId) {
            setError("Booking ID không được để trống.");
            return;
        }
        if (!bookingIdRegex.test(bookingId)) {
            setError("Booking ID không hợp lệ. Vui lòng kiểm tra lại.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:9999/bookings/${bookingId}`);
            if (response.data) {
                setIsValidBooking(true);
                setSubmittedBookingId(bookingId.trim());
                setError(null);
                await sendOtp(); // Send OTP if Booking ID is valid
            }
        } catch (error) {
            setIsValidBooking(false);
            setError("Booking ID không hợp lệ. Vui lòng kiểm tra lại.");
        }
    };

    const handleOtpVerification = async () => {
        // Validate OTP
        const otpRegex = /^[0-9]+$/; // Numeric only
        if (!otp) {
            setOtpError("Mã OTP không được để trống.");
            return;
        }
        if (!otpRegex.test(otp)) {
            setOtpError("OTP không hợp lệ. Vui lòng thử lại.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:9999/email/verify-otp/${bookingId}`, { otp });
            if (response.data.success) {
                setIsOtpValid(true);
                setOtpError(null);
            } else {
                setOtpError("OTP không hợp lệ. Vui lòng thử lại.");
            }
        } catch (error) {
            setOtpError("Không thể xác minh OTP. Vui lòng thử lại.");
        }
    };

    // Gửi OTP ngay sau khi Booking ID hợp lệ
    const sendOtp = async () => {
        setIsOtpSending(true); // Start loading
        try {
            await axios.post(`http://localhost:9999/email/send-otp/${bookingId}`);
            setIsOtpSent(true);  // Indicate OTP sent successfully
            setOtpError(null);   // Clear OTP errors
        } catch (error) {
            setOtpError("Không thể gửi OTP. Vui lòng thử lại.");
        } finally {
            setIsOtpSending(false); // Stop loading
        }
    };




    return (
        <Container>
            <h2 className="my-4">Thông tin đơn đặt</h2>

            {/* Form để nhập Booking ID */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="bookingId">
                    <Form.Label>Nhập Booking ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập Booking ID"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)} // Theo dõi sự thay đổi của Booking ID
                        maxLength={30}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Tải lại thông tin đơn đặt
                </Button>
            </Form>

            {/* Hiển thị thông báo lỗi nếu Booking ID không hợp lệ */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {/* Display the OTP form only if OTP is sent */}
            {isOtpSending ? (
                <Alert variant="info" className="mt-3">Đang gửi OTP...</Alert>
            ) : (
                isOtpSent && !isOtpValid && (
                    <Form className="mt-4">
                        <Form.Group controlId="otp">
                            <Form.Label>Nhập OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)} // Track OTP changes
                                maxLength={10}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleOtpVerification} className="mt-3">
                            Xác minh OTP
                        </Button>
                        {otpError && <Alert variant="danger" className="mt-3">{otpError}</Alert>}
                    </Form>
                )
            )}


            {/* Render AddServiceForBookingId nếu Booking ID và OTP hợp lệ */}
            {isValidBooking && isOtpValid && submittedBookingId && (
                <div className="mt-4">
                    <UpdateAndRefund ref={addServiceRef} bookingId={submittedBookingId} />

                </div>
            )}
        </Container>
    );
};

export default PageAddServices;
