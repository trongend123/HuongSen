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
        fullname: '',
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
                const taxResponse = await axios.get('http://localhost:9999/taxes');
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');

                const defaultTax = taxResponse.data.find(tax => tax.code === '000000');

                if (defaultTax) {
                    setBookingData(prevData => ({
                        ...prevData,
                        taxId: defaultTax._id
                    }));
                }

                setTaxes(taxResponse.data);
                setRoomCategories(roomCategoriesResponse.data);

                // Set default quantity for each room category to 0
                const initialQuantity = {};
                roomCategoriesResponse.data.forEach(room => {
                    initialQuantity[room._id] = 0; // Set default quantity to 0
                });
                setQuantity(initialQuantity); // Update the quantity state

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
                // Update booking and customer
                const bookingResponse = await axios.put(`http://localhost:9999/bookings/${bookingId}`, bookingData);
                const customerResponse = await axios.put(`http://localhost:9999/customers/${customerId}`, customerData);
                console.log('Booking updated:', bookingResponse);
                console.log('Customer updated:', customerResponse);

                // Fetch and update room orders
                const existingOrderRooms = await axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`);

                await handleRoomOrders(existingOrderRooms.data, customerId, bookingId);
            } else {
                // Create new customer and booking
                const customerResponse = await axios.post('http://localhost:9999/customers', customerData);
                const bookingResponse = await axios.post('http://localhost:9999/bookings', bookingData);

                const newBookingId = bookingResponse.data._id;
                const newCustomerId = customerResponse.data._id;

                setBookingId(newBookingId);

                setCustomerId(newCustomerId);

                setIsUpdating(true);
                setShowRoomCategories(true);
                // Create room orders
                await handleRoomOrders([], newCustomerId, newBookingId);
                console.log('Room orders created successfully');
            }
        } catch (error) {
            console.error('Error processing booking or room orders:', error);
        }
    };

    const handleRoomOrders = async (existingOrderRooms, cusId, bookId) => {

        const orderRoomPromises = Object.entries(quantity).map(async ([roomCateId, qty]) => {
            if (qty > 0) {
                // Check if the room order exists, update or create accordingly
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                console.log(existingOrderRoom)

                if (existingOrderRoom) {
                    return axios.put(`http://localhost:9999/orderRooms/${existingOrderRoom._id}`, { quantity: qty });
                } else {

                    return axios.post('http://localhost:9999/orderRooms', {
                        roomCateId,
                        customerId: cusId,
                        bookingId: bookId,
                        quantity: qty
                    });
                }
            } else if (qty == 0) {
                // If quantity is 0, delete the order room if it exists
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                console.log(existingOrderRoom)
                if (existingOrderRoom) {
                    return axios.delete(`http://localhost:9999/orderRooms/${existingOrderRoom._id}`);
                }
            }
            return null;
        });

        await Promise.all(orderRoomPromises);
    };

    return (
        <Container className='mb-3'>
            <h2 className="my-4">{isUpdating ? 'Update Booking' : 'Create Booking by Staff'}</h2>
            <Form onSubmit={handleSubmit}>
                {/* Customer Creation Form */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="fullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                value={customerData.fullname}
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


                <Row className="mt-4">
                    <h4>Room Categories</h4>
                    {roomCategories.map((room) => (
                        <Row key={room._id} className="mb-2">
                            <Col xs={6}>{room.name} - {room.price} VND - {room.locationId.name}</Col>
                            <Col xs={6}>
                                <Form.Control
                                    type="number"
                                    placeholder="Số lượng"
                                    value={quantity[room._id] || 0} // Set default value to 0
                                    onChange={(e) => handleQuantityChange(e, room._id)}
                                />
                            </Col>
                        </Row>
                    ))}
                </Row>



                <Button variant="primary" type="submit">
                    {isUpdating ? 'Cập nhật dữ liệu' : 'Tạo mới dữ liệu'}
                </Button>
            </Form>
        </Container>
    );
};

export default CreateBookingByStaff;
