import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const CreateBookingByStaff = () => {
    const navigate = useNavigate(); // Initialize navigate
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
        dob: ''
    });

    const [identifycationData, setIdentifycationData] = useState({
        name: '',
        code: '',
        dateStart: today,
        dateEnd: tomorrow,
        location: '',
        customerID: null // This will be set after customer is created
    });

    const [errors, setErrors] = useState({});

    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalRoomsByCategory, setTotalRoomsByCategory] = useState([]);
    const [remainingRooms, setRemainingRooms] = useState({}); // Khởi tạo state để lưu số phòng còn lại

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const totalRoomsResponse = await axios.get('http://localhost:9999/rooms/category/totals');
                setTotalRoomsByCategory(totalRoomsResponse.data.categoryTotals); // Sử dụng categoryTotals

                const bookedRoomsResponse = await axios.get(`http://localhost:9999/orderRooms/totalbycategory/?checkInDate=${bookingData.checkin}&checkOutDate=${bookingData.checkout}`);
                const bookedRoomsMap = {};

                bookedRoomsResponse.data.forEach(item => {
                    bookedRoomsMap[item.roomCateId] = item.totalRooms;
                });

                const initialRemainingRooms = {};
                totalRoomsResponse.data.categoryTotals.forEach(room => {
                    const totalRooms = room.totalRooms;
                    const bookedRooms = bookedRoomsMap[room.roomCateId] || 0;
                    initialRemainingRooms[room.roomCateId] = totalRooms - bookedRooms;
                });

                setRemainingRooms(initialRemainingRooms);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRoomData();
    }, [bookingData.checkin, bookingData.checkout]);

    useEffect(() => {
        const fetchRoomCategories = async () => {
            try {
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');
                setRoomCategories(roomCategoriesResponse.data);

                const initialQuantity = {};
                roomCategoriesResponse.data.forEach(room => {
                    initialQuantity[room._id] = 0;
                });
                setQuantity(initialQuantity);
            } catch (error) {
                console.error('Error fetching taxes or room categories:', error);
            }
        };

        fetchRoomCategories();
    }, []);

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleIdentifycationChange = (e) => {
        setIdentifycationData({
            ...identifycationData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (e, roomId) => {
        const value = Math.max(0, Math.min(e.target.value, remainingRooms[roomId] || 0));
        setQuantity({
            ...quantity,
            [roomId]: value
        });
    };

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const calculateTotalAmount = () => {
        let total = 0;

        const checkinDate = new Date(bookingData.checkin);
        const checkoutDate = new Date(bookingData.checkout);
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        roomCategories.forEach((room) => {
            const qty = quantity[room._id] || 0;
            if (qty > 0) {
                total += room.price * qty * nights;
            }
        });

        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [bookingData.checkin, bookingData.checkout, quantity]);

    const validateForm = () => {
        const newErrors = {};

        // Validate for customer data (existing logic)
        if (!customerData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Please enter a valid Vietnamese phone number (10 or 11 digits)";
        }

        const today = new Date();
        const dob = new Date(customerData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
            newErrors.dob = "Customer must be at least 18 years old";
        }

        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Check-in date cannot be in the past";
        }

        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Check-out date must be at least 1 day after check-in";
        }

        const selectedRooms = Object.values(quantity).some(qty => qty > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Please select at least one room with a quantity greater than 0";
        }

        // Validate for Identifycation data (new logic)
        if (!identifycationData.name.trim()) {
            newErrors.name = "Identifycation name is required";
        }

        if (!identifycationData.code.trim()) {
            newErrors.code = "Identifycation code is required";
        }

        const identifycationStartDate = new Date(identifycationData.dateStart);
        const identifycationEndDate = new Date(identifycationData.dateEnd);

        if (!identifycationData.dateStart) {
            newErrors.dateStart = "Start date is required";
        }

        if (!identifycationData.dateEnd) {
            newErrors.dateEnd = "End date is required";
        } else if (identifycationEndDate <= identifycationStartDate) {
            newErrors.dateEnd = "End date must be after start date";
        }

        if (!identifycationData.location.trim()) {
            newErrors.location = "Location is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form has errors, fix them first.");
            return;
        }

        try {
            let totalPrice = 0;
            const checkinDate = new Date(bookingData.checkin);
            const checkoutDate = new Date(bookingData.checkout);
            const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

            roomCategories.forEach((room) => {
                const qty = quantity[room._id] || 0;
                if (qty > 0) {
                    totalPrice += room.price * qty * nights;
                }
            });

            setBookingData((prevData) => ({
                ...prevData,
                price: totalPrice,
            }));

            const customerResponse = await axios.post('http://localhost:9999/customers', customerData);
            const bookingResponse = await axios.post('http://localhost:9999/bookings', { ...bookingData, price: totalPrice });

            const newBookingId = bookingResponse.data._id;
            const newCustomerId = customerResponse.data._id;

            const orderRoomPromises = Object.entries(quantity).map(async ([roomCateId, qty]) => {
                if (qty > 0) {
                    return axios.post('http://localhost:9999/orderRooms', {
                        roomCateId,
                        customerId: newCustomerId,
                        bookingId: newBookingId,
                        quantity: qty
                    });
                }
            });

            await Promise.all(orderRoomPromises);

            // Submit Identifycation data with customer ID
            await axios.post('http://localhost:9999/identifycations', {
                ...identifycationData,
                customerID: newCustomerId
            });

            console.log('Booking, room orders, and identifycation created successfully');

            navigate('/bookings');

        } catch (error) {
            console.error('Error processing booking or room orders:', error);
        }
    };

    return (
        <Container className='mb-3'>
            <h2 className="my-4">Create Booking by Staff</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
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
                                        isInvalid={!!errors.fullname}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!errors.email}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="phone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={customerData.phone}
                                        onChange={handleCustomerChange}
                                        isInvalid={!!errors.phone}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="dob">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dob"
                                        value={customerData.dob}
                                        onChange={handleCustomerChange}
                                        isInvalid={!!errors.dob}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.dob}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>


                        </Row>
                    </Col>
                    <Col>
                        {/* Identifycation Fields */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Identifycation Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter identifycation name'
                                        name='name'
                                        value={identifycationData.name}
                                        onChange={handleIdentifycationChange}
                                        isInvalid={!!errors.name}  // Hiển thị lỗi nếu có
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Identifycation Code</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter identifycation code'
                                        name='code'
                                        value={identifycationData.code}
                                        onChange={handleIdentifycationChange}
                                        isInvalid={!!errors.code}  // Hiển thị lỗi nếu có
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.code}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Identifycation Start Date</Form.Label>
                                    <Form.Control
                                        type='date'
                                        name='dateStart'
                                        value={identifycationData.dateStart}
                                        onChange={handleIdentifycationChange}
                                        isInvalid={!!errors.dateStart}  // Hiển thị lỗi nếu có
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.dateStart}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Identifycation End Date</Form.Label>
                                    <Form.Control
                                        type='date'
                                        name='dateEnd'
                                        value={identifycationData.dateEnd}
                                        onChange={handleIdentifycationChange}
                                        isInvalid={!!errors.dateEnd}  // Hiển thị lỗi nếu có
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.dateEnd}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Identifycation Location</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter location'
                                        name='location'
                                        value={identifycationData.location}
                                        onChange={handleIdentifycationChange}
                                        isInvalid={!!errors.location}  // Hiển thị lỗi nếu có
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.location}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                </Row>


                <h2>Room Selection</h2>
                {/* Booking Information Form */}
                <Row className="mb-3" md={9}>
                    <Col md={4}>
                        <Form.Group controlId="checkin">
                            <Form.Label className='mx-2'>
                                <strong>Check-in Date: </strong>
                            </Form.Label>
                            <Form.Control
                                className='w-50 mx-2'
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                                isInvalid={!!errors.checkin}  // Hiển thị lỗi nếu có
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkin}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="checkout">
                            <Form.Label className='mx-2' >
                                <strong>Check-out Date:</strong>
                            </Form.Label>
                            <Form.Control
                                className='w-50 mx-2'
                                type="date"
                                name="checkout"
                                value={bookingData.checkout}
                                onChange={handleChange}
                                isInvalid={!!errors.checkout}  // Hiển thị lỗi nếu có
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkout}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>


                {/* Room Category and Quantity Form */}

                {roomCategories.map(room => {
                    const totalRoomData = totalRoomsByCategory.find(r => r.roomCateId === room._id); // Find total room information
                    const remainingRoomCount = remainingRooms[room._id] || 0; // Get remaining room count

                    return (
                        <Row key={room._id} className="mb-3">
                            <Col className='col-5'>
                                <Form.Label>{room.name} (Price: {room.price} VND) - {room.locationId.name}</Form.Label>
                                <p><strong>Số phòng còn lại:</strong> {remainingRoomCount} / {totalRoomData ? totalRoomData.totalRooms : 0}</p> {/* Display remaining rooms */}
                            </Col>
                            <Col className='col-2'>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max={remainingRoomCount} // Limit input to max remaining rooms
                                    value={quantity[room._id] || 0}
                                    onChange={(e) => handleQuantityChange(e, room._id)}
                                    required
                                />
                            </Col>
                        </Row>
                    );
                })}
                {errors.roomSelection && <p className="text-danger">{errors.roomSelection}</p>}

                {/* Total Price */}
                <Row className="mb-3">
                    <Col>
                        <h5>Total Amount: {totalAmount}</h5>
                    </Col>
                </Row>

                {/* Submit Button */}
                <Button type="submit" variant="primary">Create Booking</Button>
            </Form>
        </Container>
    );
};

export default CreateBookingByStaff;
