import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CreateBookingByStaff = () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    const [bookingData, setBookingData] = useState({
        taxId: null,
        staffId: null,
        status: 'In Progress',
        payment: 'Chưa Thanh Toán',
        price: 0,
        checkin: today,
        checkout: tomorrow,
        note: ''
    });

    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '' // Add dob field here
    });

    const [taxes, setTaxes] = useState([]);
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [bookingId, setBookingId] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showRoomCategories, setShowRoomCategories] = useState(false);

    useEffect(() => {
        const fetchTaxesAndRoomCategories = async () => {
            try {
                const taxResponse = await axios.get('http://localhost:9999/taxes/taxes');
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');
                setTaxes(taxResponse.data);
                setRoomCategories(roomCategoriesResponse.data);
            } catch (error) {
                console.error('Error fetching taxes or room categories:', error);
            }
        };

        fetchTaxesAndRoomCategories();
    }, []);

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (e, roomId) => {
        setQuantity({
            ...quantity,
            [roomId]: e.target.value
        });
    };

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdating && bookingId) {
                const response = await axios.put(`http://localhost:9999/bookings/${bookingId}`, bookingData);
                console.log('Booking updated:', response);
            } else {
                const response = await axios.post('http://localhost:9999/bookings', bookingData);
                const responseC = await axios.post('http://localhost:9999/customers', customerData);
                console.log('Customer created:', responseC);
                console.log('Booking created:', response);
                let bookingId = response.data._id;
                let customerId = responseC.data._id;
                setBookingId(bookingId);
                setCustomerId(customerId);
                setIsUpdating(true);
                setShowRoomCategories(true);
            }
        } catch (error) {
            console.error('Error processing booking:', error);
        }
    };

    return (
        <Container>
            <h2 className="my-4">{isUpdating ? 'Update Booking' : 'Create Booking by Staff'}</h2>
            <Form onSubmit={handleSubmit}>
                {/* Customer Creation Form */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={customerData.name}
                                onChange={handleCustomerChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={customerData.email}
                                onChange={handleCustomerChange}
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={customerData.phone}
                                onChange={handleCustomerChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* New Date of Birth Field */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="dob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={customerData.dob}
                                onChange={handleCustomerChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="checkin">
                            <Form.Label>Check-in Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="checkout">
                            <Form.Label>Check-out Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkout"
                                value={bookingData.checkout}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="taxId">
                            <Form.Label>Tax ID</Form.Label>
                            <Form.Control
                                as="select"
                                name="taxId"
                                value={bookingData.taxId || ''}
                                onChange={handleChange}
                            >
                                <option value="">Chọn thuế</option>
                                {taxes.map((tax) => (
                                    <option key={tax._id} value={tax._id}>
                                        {tax.name} ({tax.rate}%)
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="note">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="note"
                        value={bookingData.note}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isUpdating ? 'Cập nhật dữ liệu' : 'Tạo mới dữ liệu'}
                </Button>
            </Form>

            {showRoomCategories && (
                <Form>
                    <div className="mt-4">
                        <h4>Room Categories</h4>
                        {roomCategories.map((room) => (
                            <Row key={room._id} className="mb-2">
                                <Col xs={6}>{room.name} - {room.price} VND - {room.locationId.name}</Col>
                                <Col xs={6}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Số lượng"
                                        value={quantity[room._id] || ''}
                                        onChange={(e) => handleQuantityChange(e, room._id)}
                                    />
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Form>
            )}
        </Container>
    );
};

export default CreateBookingByStaff;
