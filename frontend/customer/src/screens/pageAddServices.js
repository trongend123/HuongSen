// PageAddServices.js
import { useState, useRef } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import AddServiceForBookingId from '../components/addServiceForBookingId';
import axios from 'axios';

const PageAddServices = () => {
    const [bookingId, setBookingId] = useState('');
    const [submittedBookingId, setSubmittedBookingId] = useState(null);
    const [isValidBooking, setIsValidBooking] = useState(null); // Trạng thái kiểm tra tồn tại bookingId
    const [error, setError] = useState(null); // Trạng thái hiển thị lỗi

    const addServiceRef = useRef(null); // Create ref for AddServiceForBookingId

    // Handle form submission to validate and set the bookingId
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:9999/bookings/${bookingId}`);
            if (response.data) {
                setIsValidBooking(true);
                setSubmittedBookingId(bookingId);
                setError(null);
            }
        } catch (error) {
            setIsValidBooking(false);
            setError("Booking ID does not exist. Please check and try again.");
        }
    };

    // Function to call updateBooking from AddServiceForBookingId component
    const handleUpdateBooking = async () => {
        if (addServiceRef.current) {
            await addServiceRef.current.updateBooking();
        }
    };

    return (
        <Container>
            <h2 className="my-4">Thông tin đơn đặt</h2>

            {/* Form to input the booking ID */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="bookingId">
                    <Form.Label>Enter Booking ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter booking ID"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Load Booking
                </Button>
            </Form>

            {/* Display error if booking ID is invalid */}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

            {/* Conditionally render AddServiceForBookingId if bookingId is valid */}
            {isValidBooking && submittedBookingId && (
                <div className="mt-4">
                    <AddServiceForBookingId ref={addServiceRef} bookingId={submittedBookingId} />
                    <Button
                        variant="success"
                        onClick={handleUpdateBooking}
                        className="mt-3"
                    >
                        Update Booking
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default PageAddServices;
