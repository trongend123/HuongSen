import React, { useState, useRef } from 'react';
import AddUserForm from '../components/bookingRoom/addUserForm';
import AddIdentifyForm from '../components/bookingRoom/addIdentifyForm';
import { Col, Row, Button } from 'react-bootstrap';
import AddBookingForm from '../components/bookingRoom/addBookingForm';
import AddServiceForm from '../components/bookingRoom/addServiceForm';
import axios from 'axios';
import { BASE_URL } from '../utils/config'; 


const BookingPage = ({ locationId }) => {
    const [userId, setUserId] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const userFormRef = useRef(null);
    const identifyFormRef = useRef(null);
    const bookingFormRef = useRef(null);
    const addServiceRef = useRef(null);
    const [serviceTotal, setServiceTotal] = useState(0);

    const handleServiceTotalChange = (total) => {
        setServiceTotal(total);
    };

    const handleCreateBoth = async () => {
        try {
            const createdUserId = await userFormRef.current.createUser();
            if (createdUserId) {
                setUserId(createdUserId);
                const createdBookingId = await bookingFormRef.current.createBooking();
                if (createdBookingId) {
                    setBookingId(createdBookingId);
                    await identifyFormRef.current.createIdentify(createdUserId);
                    await addServiceRef.current.addService(createdBookingId);
                    console.log('Booking and services created successfully!');

                    // Redirect to payment after successfully creating the booking
                    await handlePayment(createdBookingId);
                } else {
                    console.log('Booking and services not created');
                }
            } else {
                console.log('User creation failed.');
            }
        } catch (error) {
            console.error('Error creating user, identification, or booking:', error);
            alert('An error occurred during creation.');
        }
    };

    const handlePayment = async (bookingId) => {
        try {
            // Assuming you have a method to get the booking details
            const bookingResponse = await axios.get(`${BASE_URL}/booking/${bookingId}`, { withCredentials: true });
            const booking = bookingResponse.data;

            const response = await axios.post(
                `${BASE_URL}/payment/create-payment-link`,
                {
                    amount: booking.price,
                    bookingId: booking._id,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                const { checkoutUrl } = response.data;
                window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
            } else {
                console.error('Failed to create payment link');
            }
        } catch (error) {
            console.error('Error creating payment link:', error);
        }
    };

    return (
        <div>
            <h3>Đặt phòng ngay</h3>
            <Row>
                <Col md="6">
                    <AddUserForm ref={userFormRef} />
                    <AddIdentifyForm ref={identifyFormRef} />
                    <AddServiceForm
                        ref={addServiceRef}
                        bookingId={bookingId}
                        onServiceTotalChange={handleServiceTotalChange}
                    />
                </Col>
                <Col>
                    <AddBookingForm
                        ref={bookingFormRef}
                        onBookingCreated={setBookingId}
                        customerID={userId}
                        serviceAmount={serviceTotal}
                        locationId={locationId}
                    />
                    <Button className='text-bg-success fs-3' onClick={handleCreateBoth}>
                        Đặt Phòng Ngay
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default BookingPage;