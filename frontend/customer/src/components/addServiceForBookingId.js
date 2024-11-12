import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import axios from 'axios';
import AddServiceForm from '../components/bookingRoom/addServiceForm'; // Import AddServiceForm
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap'; // Import React Bootstrap components

const BookingDetails = forwardRef(({ bookingId }, ref) => {
    const [bookingData, setBookingData] = useState(null);
    const [services, setServices] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0); // To hold total amount
    const [error, setError] = useState(null); // To handle error messages
    const addServiceRef = useRef(); // Create a ref for AddServiceForm
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch booking details
        axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`)
            .then(response => {
                if (response.data.length > 0) {
                    setBookingData(response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching booking details:", error);
                setError("Failed to load booking details.");
            });

        // Fetch booked services
        axios.get(`http://localhost:9999/orderServices/booking/${bookingId}`)
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error("Error fetching services:", error);
                setError("Failed to load services.");
            });
    }, [bookingId]);

    // Callback for when services are added or updated
    // const handleServiceTotalChange = (newTotalAmount) => {
    //     if (bookingData && bookingData.length > 0) {
    //         setTotalAmount(newTotalAmount + bookingData[0].price); // Add base price to service total
    //     }
    // };

    // Callback for when services are added or updated
    const handleServiceTotalChange = (newTotalAmount) => {
        setTotalAmount(newTotalAmount + bookingData[0].bookingId.price);
    };
    // Function to update booking (e.g., after adding services)
    const updateBooking = async () => {


        try {

            await addServiceRef.current.addService(bookingId); // Call method in AddServiceForm via ref
            console.log('Booking and services updated successfully!');

            // Prepare the updated booking data
            const updatedBooking = {
                ...bookingData.bookingId,
                price: totalAmount

            };

            // console.log(updatedBooking);

            // Update booking details
            await axios.put(`http://localhost:9999/bookings/${bookingId}`, updatedBooking);

            // After successful update, navigate to SaveHistory route with bookingId
            // navigate(`/saveHistory`, {
            //     state: {
            //         bookingId: bookingId,
            //         note: `${customerId.email} đã update dữ liệu Booking`,

            //     }
            // });

        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        updateBooking // Expose updateBooking to parent component
    }));

    if (!bookingData) return <p>Loading booking details...</p>;

    const { customerId, bookingId: bookingInfo } = bookingData[0];

    return (
        <Container>
            {/* Error handling */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className='mb-3'>
                {/* Customer Information */}
                <Col md={5}>
                    <Card>
                        <Card.Header className='fs-4 fw-bold'>Thông tin khách hàng</Card.Header>
                        <Card.Body>
                            <p><strong>Họ và tên:</strong> {customerId.fullname}</p>
                            <p><strong>Email:</strong> {customerId.email}</p>
                            <p><strong>Số điện thọai:</strong> {customerId.phone}</p>
                            <p><strong>Ngày sinh:</strong> {new Date(customerId.dob).toLocaleDateString()}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Booking Information */}
                <Col md={7}>
                    <Card>
                        <Card.Header className='fs-4 fw-bold'>Thông tin đặt phòng</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <p><strong>Ngày Check-in:</strong> {new Date(bookingInfo.checkin).toLocaleDateString()}</p>
                                    <p><strong>Ngày Check-out:</strong> {new Date(bookingInfo.checkout).toLocaleDateString()}</p>
                                    <p><strong>Tổng chi phí:</strong> {bookingInfo.price} VND</p>
                                </Col>
                                <Col>
                                    <p><strong>Số người:</strong> {bookingInfo.humans}</p>
                                    <p><strong>Trạng thái:</strong> {bookingInfo.status}</p>
                                    <p><strong>Trạng thái thanh toán:</strong> {bookingInfo.payment}</p>
                                </Col>
                            </Row>

                            <p><strong>Note:</strong> {bookingInfo.note}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md="4">
                    {/* Room Details */}
                    <Card className="mb-3">
                        <Card.Header className="fs-5 fw-bold text-center">Loại phòng & Số lượng</Card.Header>
                        <Card.Body>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Loại phòng</th>
                                        <th>Giá phòng</th>
                                        <th>Số lượng đặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookingData.map((item, index) => (
                                        <tr key={`${item.roomCateId._id}-${index}`}>
                                            <td>{item.roomCateId.name}</td>
                                            <td>{item.roomCateId.price} VND</td>
                                            <td>{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md="8">
                    {/* Booked Services */}
                    {services.length > 0 ? (
                        <Card className="mb-3">
                            <Card.Header className='fs-5 fw-bold text-center'>Dịch vụ đã đặt</Card.Header>
                            <Card.Body>
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Tên dịch vụ</th>
                                            <th>Mô tả</th>
                                            <th>Giá</th>
                                            <th>Đơn vị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map((service, index) => (
                                            <tr key={`${service.otherServiceId._id}-${index}`}>
                                                <td>{service.otherServiceId.name}</td>
                                                <td>{service.otherServiceId.description}</td>
                                                <td>{service.otherServiceId.price} VND</td>
                                                <td>{service.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p>No services booked.</p>
                    )}
                </Col>
            </Row>

            {/* Add Service Form */}
            <AddServiceForm
                ref={addServiceRef} // Pass ref to AddServiceForm
                bookingId={bookingId}
                onServiceTotalChange={handleServiceTotalChange} // Update total when services are added
            />

            {/* Total Price of Services */}
            <h4 className="mt-4">Total Price of Services: {totalAmount} VND</h4>

            {/* Update Booking Button */}
            {/* <Button onClick={updateBooking} variant="primary" className="mt-3">Update Booking</Button> */}
        </Container>
    );
});

export default BookingDetails;
