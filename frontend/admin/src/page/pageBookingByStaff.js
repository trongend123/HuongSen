import React, { useState, useRef, useEffect } from 'react';
import AddUserForm from '../components/bookingRoom/addUserForm';
import AddIdentifyForm from '../components/bookingRoom/addIdentifyForm';
import { Col, Row, Button, Container } from 'react-bootstrap';
import AddBookingForm from '../components/bookingRoom/addBookingForm';
import AddServiceForm from '../components/bookingRoom/addServiceForm';

const BookingPage = () => {
    const [userId, setUserId] = useState(null); // To store the created user ID
    const [bookingId, setBookingId] = useState(null); // To store the created booking ID
    const userFormRef = useRef(null);           // Reference to the user form
    const identifyFormRef = useRef(null);       // Reference to the identification form
    const bookingFormRef = useRef(null);        // Reference to the booking form (optional for future use)
    const addServiceRef = useRef(null);         // Reference to the AddServiceForm
    const [staff, setStaff] = useState(null);
    const [locationId, setLocationId] = useState(null);
    const [serviceTotal, setServiceTotal] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userResponse = JSON.parse(storedUser);
            setStaff(userResponse);
        }
    }, []);

    useEffect(() => {
        if (staff) {
            if (staff.role === 'staff_mk') {
                setLocationId('66f6c42f285571f28087c16a');
            } else if (staff.role === 'staff_ds') {
                setLocationId('66f6c536285571f28087c16b');
            } else if (staff.role === 'staff_cb') {
                setLocationId('66f6c59f285571f28087c16d');
            }
        }

    }, [staff]); // Only update locationId when staff changes

    // Handler for service total changes
    const handleServiceTotalChange = (total) => {
        setServiceTotal(total);
    };

    const handleCreateBoth = async () => {
        try {
            // 1. Create user
            const createdUserId = await userFormRef.current.createUser();
            if (createdUserId) {
                setUserId(createdUserId); // Store user ID
                console.log("User created with ID:", createdUserId);

                // 3. Create booking
                const createdBookingId = await bookingFormRef.current.createBooking();
                if (createdBookingId) {
                    setBookingId(createdBookingId); // Store booking ID
                    // 2. Create identity after user is created
                    await identifyFormRef.current.createIdentify(createdUserId);
                    // 4. Add selected services to orderService after booking is created
                    await addServiceRef.current.addService(createdBookingId);
                    console.log('Booking and services created successfully!');
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

    return (
        <Container>
            <h6 className="my-4 px-2 text-bg-success d-inline ">Đặt Phòng Từ Nhân Viên: {staff?.fullname || "chưa Login"}</h6>
            <Row>
                <Col md="6">
                    {/* User Form */}
                    <AddUserForm ref={userFormRef} />

                    {/* Identification Form */}
                    <AddIdentifyForm ref={identifyFormRef} />

                    {/* Service Form */}
                    <AddServiceForm
                        ref={addServiceRef}
                        bookingId={bookingId} // Pass booking ID after it's created
                        onServiceTotalChange={handleServiceTotalChange} // Callback for service total
                    />
                </Col>

                <Col>
                    {/* Booking Form */}
                    <AddBookingForm
                        ref={bookingFormRef}
                        onBookingCreated={setBookingId}
                        customerID={userId}
                        serviceAmount={serviceTotal}
                        locationId={locationId}
                        staff={staff} // Pass locationId here
                    />
                    <Button className='text-bg-success fs-3' onClick={handleCreateBoth}>
                        Đặt Phòng Ngay
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingPage;
