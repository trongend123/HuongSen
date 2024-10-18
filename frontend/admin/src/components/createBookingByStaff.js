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

    const [errors, setErrors] = useState({});
    const [taxes, setTaxes] = useState([]);
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);

    const [totalRoomsByCategory, setTotalRoomsByCategory] = useState([]);
    const [remainingRooms, setRemainingRooms] = useState({}); // Khởi tạo state để lưu số phòng còn lại

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                // Gọi hàm để lấy tổng số phòng theo từng loại
                const totalRoomsResponse = await axios.get('http://localhost:9999/rooms/category/totals');
                setTotalRoomsByCategory(totalRoomsResponse.data.categoryTotals); // Sử dụng categoryTotals

                // Gọi hàm để lấy số phòng đã đặt
                const bookedRoomsResponse = await axios.get(`http://localhost:9999/orderRooms/totalbycategory/?checkInDate=${bookingData.checkin}&checkOutDate=${bookingData.checkout}`);
                const bookedRoomsMap = {};

                // Chuyển đổi dữ liệu thành dạng object để dễ truy cập
                bookedRoomsResponse.data.forEach(item => {
                    bookedRoomsMap[item.roomCateId] = item.totalRooms;
                });

                const initialRemainingRooms = {};
                totalRoomsResponse.data.categoryTotals.forEach(room => { // Đảm bảo sử dụng đúng cấu trúc dữ liệu
                    const totalRooms = room.totalRooms; // Lấy tổng số phòng ban đầu
                    const bookedRooms = bookedRoomsMap[room.roomCateId] || 0; // Lấy số phòng đã đặt
                    initialRemainingRooms[room.roomCateId] = totalRooms - bookedRooms; // Tính số phòng còn lại
                });

                setRemainingRooms(initialRemainingRooms); // Cập nhật state với số phòng còn lại
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRoomData();
    }, [bookingData.checkin, bookingData.checkout]);


    useEffect(() => {
        const fetchTaxesAndRoomCategories = async () => {
            try {
                const taxResponse = await axios.get('http://localhost:9999/taxes');
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');
                setTaxes(taxResponse.data);
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

        fetchTaxesAndRoomCategories();
    }, []);

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (e, roomId) => {
        const value = Math.max(0, Math.min(e.target.value, remainingRooms[roomId] || 0)); // Ensure the value is between 0 and remainingRooms
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

        // Fullname validation
        if (!customerData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (Vietnamese phone numbers)
        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Please enter a valid Vietnamese phone number (10 or 11 digits)";
        }

        // Date of Birth validation (at least 18 years old)
        const today = new Date();
        const dob = new Date(customerData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
            newErrors.dob = "Customer must be at least 18 years old";
        }

        // Check-in date validation
        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Check-in date cannot be in the past";
        }

        // Check-out date validation
        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Check-out date must be at least 1 day after check-in";
        }

        // Room selection validation (at least one room must have quantity > 0)
        const selectedRooms = Object.values(quantity).some(qty => qty > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Please select at least one room with a quantity greater than 0";
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

        // Rest of the submit logic
        try {
            // Calculate the total price based on room quantities and nights
            let totalPrice = 0;

            const checkinDate = new Date(bookingData.checkin);
            const checkoutDate = new Date(bookingData.checkout);
            const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // convert milliseconds to days

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

            console.log('Booking and room orders created successfully');

            // Redirect to bookings list page
            navigate('/bookings');

        } catch (error) {
            console.error('Error processing booking or room orders:', error);
        }
    };

    return (
        <Container className='mb-3'>
            <h2 className="my-4">Create Booking by Staff</h2>
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
                </Row>

                <Row className="mb-3">
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

                {/* Booking Information Form */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="checkin">
                            <Form.Label>Check-in Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="checkin"
                                value={bookingData.checkin}
                                onChange={handleChange}
                                isInvalid={!!errors.checkin}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkin}
                            </Form.Control.Feedback>
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
                                isInvalid={!!errors.checkout}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.checkout}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Room Category and Quantity Form */}
                <h4>Room Selection</h4>
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
