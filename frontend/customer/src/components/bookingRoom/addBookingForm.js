import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card, Alert } from 'react-bootstrap'; // Import Alert
import SelectRoomCategories from './selectRoomCate';  // Import SelectRoomCategories component

const AddBookingForm = forwardRef(({ onBookingCreated, customerID, serviceAmount, locationId }, ref) => {
    const roomCategoriesRef = useRef(null);  // Ref for SelectRoomCategories

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');  // State to store error message
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const [totalAmount, setTotalAmount] = useState(0);
    const [roomPrices, setRoomPrices] = useState({});  // Store room prices per category
    const [totalRoomsRemaining, setTotalRoomsRemaining] = useState(0);  // Store total remaining rooms

    const [bookingData, setBookingData] = useState({
        taxId: null,
        staffId: null,
        status: 'In Progress',
        payment: 'Chưa Thanh Toán',
        price: 0,
        checkin: today,
        checkout: tomorrow,
        note: '',
        humans: 1,
        contract: ''
    });

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const calculateTotalAmount = () => {
        // Tính tổng tiền phòng trước
        let totalRoomAmount = Object.values(roomPrices).reduce((sum, price) => sum + price, 0);

        // Cộng thêm serviceAmount vào tổng tiền
        let total = totalRoomAmount + serviceAmount;

        setTotalAmount(total);

        // Cập nhật giá tổng tiền trong bookingData
        setBookingData(prevBookingData => ({
            ...prevBookingData,
            price: total
        }));
    };

    useEffect(() => {
        // Cập nhật lại tổng tiền khi thay đổi giá phòng, ngày, hoặc dịch vụ
        calculateTotalAmount();
    }, [roomPrices, bookingData.checkin, bookingData.checkout, serviceAmount]);

    const handleRoomQuantityChange = (roomId, qty, price) => {
        setRoomPrices(prevPrices => ({
            ...prevPrices,
            [roomId]: price
        }));
    };

    const handleTotalRoomsRemaining = (totalRoomsRemaining) => {
        setTotalRoomsRemaining(totalRoomsRemaining);  // Update total remaining rooms
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Ngày check-in không thể là ngày trong quá khứ";
        }

        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Ngày check-out phải sau ngày check-in ít nhất 1 ngày";
        }

        const selectedRooms = Object.values(roomPrices).some(price => price > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Vui lòng chọn ít nhất một phòng với số lượng lớn hơn 0";
            setErrorMessage(newErrors.roomSelection);  // Set error message
        } else {
            setErrorMessage('');  // Clear error message if there are selected rooms
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createBooking = async () => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return;
        }
        try {
            // Cập nhật bookingData với tổng giá trị cuối cùng (bao gồm cả dịch vụ)
            const finalPrice = totalAmount;

            setBookingData(prevBookingData => ({
                ...prevBookingData,
                price: finalPrice
            }));

            // Gửi yêu cầu tạo booking
            const response = await axios.post('http://localhost:9999/bookings', {
                ...bookingData,
                price: finalPrice
            });

            const bookingId = response.data._id; // Lấy bookingId từ phản hồi

            // Gọi hàm tạo orderRoom
            await roomCategoriesRef.current.createOrderRoom(bookingId);

            // Gọi callback để thông báo đã tạo booking
            onBookingCreated(bookingId);
            return response.data._id;
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking');
        }
    };

    useImperativeHandle(ref, () => ({
        createBooking
    }));

    return (
        <Card className="mb-2">
            <Card.Header as="h5" className="bg-primary text-white">Chọn Loại Phòng & Số Lượng</Card.Header>
            <Card.Body>

                <Row className="mb-3">
                    <Col md={3}>
                        <Form.Group controlId="checkin">
                            <Form.Label><strong>Check-in Ngày: </strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                                isInvalid={!!errors.checkin}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{errors.checkin}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="checkout">
                            <Form.Label><strong>Check-out Ngày:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="checkout"
                                value={bookingData.checkout}
                                onChange={handleChange}
                                isInvalid={!!errors.checkout}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{errors.checkout}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label><strong>Số lượng người</strong></Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter number of people'
                                name='humans'
                                value={bookingData.humans}
                                onChange={handleChange}
                                isInvalid={!!errors.humans}
                                min={1}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.humans}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* SelectRoomCategories Component */}
                <SelectRoomCategories
                    ref={roomCategoriesRef}
                    checkin={bookingData.checkin}
                    checkout={bookingData.checkout}
                    onQuantityChange={handleRoomQuantityChange}
                    onTotalRoomsRemaining={handleTotalRoomsRemaining}
                    customerID={customerID}
                    locationId={locationId}
                />

                {/* Hiển thị thông báo lỗi nếu không có phòng nào được chọn */}
                {errorMessage && <Alert variant="danger" className="mt-2">{errorMessage}</Alert>}


                <Row>
                    <p><strong>Tổng Chi phí</strong> = Phí dịch vụ + Phí đặt phòng = {totalAmount} VND</p>
                </Row>


            </Card.Body>
        </Card>
    );
});

export default AddBookingForm;
