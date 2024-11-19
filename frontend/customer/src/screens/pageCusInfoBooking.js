import React, { useState, useRef } from 'react';
import AddUserForm from '../components/bookingRoom/addUserForm';
import AddIdentifyForm from '../components/bookingRoom/addIdentifyForm';
import { Col, Row, Button, Container } from 'react-bootstrap';
import AddBookingForm from '../components/bookingRoom/addBookingForm';
import AddServiceForm from '../components/bookingRoom/addServiceForm';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/config';


const CustomerBookingPage = () => {
    const [userId, setUserId] = useState(null); // To store the created user ID
    const [bookingId, setBookingId] = useState(null); // To store the created booking ID
    const [bookingPay, setBookingPpay] = useState(null);
    const userFormRef = useRef(null);           // Reference to the user form
    const identifyFormRef = useRef(null);       // Reference to the identification form
    const bookingFormRef = useRef(null);        // Reference to the booking form (optional for future use)
    const addServiceRef = useRef(null);         // Reference to the AddServiceForm
    const navigate = useNavigate();

    const { locationId } = useParams();


    const [serviceTotal, setServiceTotal] = useState(0);

    // Hàm xử lý khi tổng dịch vụ thay đổi
    const handleServiceTotalChange = (total) => {
        setServiceTotal(total);
    };

    const handleCreateBoth = async () => {
        try {
            // 1. Create user
            const createdUserId = await userFormRef.current.createUser();
            if (createdUserId) {
                setUserId(createdUserId); // Store user ID
                console.log("User created with ID");

                // 2. Create identity after user is created
                const identifyCreated = await identifyFormRef.current.createIdentify(createdUserId);
                if (!identifyCreated) {
                    console.log('Identity creation failed.');
                    alert('An error occurred while creating identity. Please try again.');
                    return; // Stop further execution if identity creation fails
                }

                // 3. Create booking
                const createdBookingId = await bookingFormRef.current.createBooking();
                if (createdBookingId) {
                    setBookingId(createdBookingId); // Store booking ID

                    // 4. Add selected services to orderService after booking is created
                    await addServiceRef.current.addService(createdBookingId);
                    console.log('Booking and services created successfully!');

                    //5. Xử ký payment
                    handlePayment(createdBookingId);
                } else {
                    alert('An error occurred while creating booking or services. Please try again.');
                    console.log('Booking and services not created.');
                }
            } else {
                alert('An error occurred while creating Customer. Please try again.');
                console.log('User creation failed.');
            }
        } catch (error) {
            console.error('Error creating user, identification, or booking:', error);
            alert('An error occurred during creation.');
        }
    };


    const handlePayment = async (createdBookingId) => {
        try {
            // Assuming you have a method to get the booking details
            const bookingResponse = await axios.get(`${BASE_URL}/bookings/${createdBookingId}`);
            const booking = bookingResponse.data;

            const response = await axios.post(
                `${BASE_URL}/payment/create-payment-link`,
                {
                    amount: booking.price,
                    bookingId: booking._id,
                }
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
            <Row>
                <Col md="6">
                    {/* User Form */}
                    <AddUserForm ref={userFormRef} />


                    {/* Service Form */}
                    <AddServiceForm
                        ref={addServiceRef}
                        bookingId={bookingId} // Pass booking ID after it's created
                        onServiceTotalChange={handleServiceTotalChange} // Callback for service total
                    />
                </Col>

                <Col>
                    {/* Identification Form */}
                    <AddIdentifyForm ref={identifyFormRef} />
                    {/* Booking Form */}
                    <AddBookingForm
                        ref={bookingFormRef}
                        onBookingCreated={setBookingId}
                        customerID={userId}
                        serviceAmount={serviceTotal}
                        locationId={locationId} // Pass locationId here
                        canInput={true}
                    />
                    <Button className='text-bg-success fs-3 ' onClick={handleCreateBoth} >
                        Đặt Phòng Ngay
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerBookingPage;
