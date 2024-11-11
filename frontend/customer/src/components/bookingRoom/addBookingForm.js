import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import SelectRoomCategories from './selectRoomCate';

const AddBookingForm = forwardRef(({ onBookingCreated, customerID, serviceAmount, locationId, canInput }, ref) => {
    const roomCategoriesRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const [totalAmount, setTotalAmount] = useState(0);
    const [roomPrices, setRoomPrices] = useState({});
    const [totalRoomsRemaining, setTotalRoomsRemaining] = useState(0);

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
        let totalRoomAmount = Object.values(roomPrices).reduce((sum, price) => sum + price, 0);
        let total = totalRoomAmount + serviceAmount;

        setTotalAmount(total);

        setBookingData(prevBookingData => ({
            ...prevBookingData,
            price: total
        }));
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [roomPrices, bookingData.checkin, bookingData.checkout, serviceAmount]);

    const handleRoomQuantityChange = (roomId, qty, price) => {
        setRoomPrices(prevPrices => ({
            ...prevPrices,
            [roomId]: price
        }));
    };

    const handleTotalRoomsRemaining = (totalRoomsRemaining) => {
        setTotalRoomsRemaining(totalRoomsRemaining);
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
            setErrorMessage(newErrors.roomSelection);
        } else {
            setErrorMessage('');
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
            const finalPrice = totalAmount;

            setBookingData(prevBookingData => ({
                ...prevBookingData,
                price: finalPrice
            }));

            const response = await axios.post('http://localhost:9999/bookings', {
                ...bookingData,
                price: finalPrice
            });

            const bookingId = response.data._id;

            await roomCategoriesRef.current.createOrderRoom(bookingId);

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

                <SelectRoomCategories
                    ref={roomCategoriesRef}
                    checkin={bookingData.checkin}
                    checkout={bookingData.checkout}
                    onQuantityChange={handleRoomQuantityChange}
                    onTotalRoomsRemaining={handleTotalRoomsRemaining}
                    customerID={customerID}
                    locationId={locationId}
                    canInput={canInput}
                />

                {errorMessage && <Alert variant="danger" className="mt-2">{errorMessage}</Alert>}

                {canInput && (
                    <Row>
                        <p><strong>Tổng Chi phí</strong> = Phí dịch vụ + Phí đặt phòng = {totalAmount} VND</p>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
});

export default AddBookingForm;
