import React, { useState, useRef } from 'react';
import AddUserForm from './bookingRoom/addUserForm';
import AddIdentifyForm from './bookingRoom/addIdentifyForm';
import { Col, Row, Button } from 'react-bootstrap';
import AddBookingForm from './bookingRoom/addBookingForm';
import AddServiceForm from './bookingRoom/addServiceForm';

const BookingPage = ({ locationId }) => {
    const [userId, setUserId] = useState(null); // To store the created user ID
    const [bookingId, setBookingId] = useState(null); // To store the created booking ID
    const userFormRef = useRef(null);           // Reference to the user form
    const identifyFormRef = useRef(null);       // Reference to the identification form
    const bookingFormRef = useRef(null);        // Reference to the booking form (optional for future use)
    const addServiceRef = useRef(null);         // Reference to the AddServiceForm

    const [serviceTotal, setServiceTotal] = useState(0);

    // Hàm xử lý khi tổng dịch vụ thay đổi
    const handleServiceTotalChange = (total) => {
        setServiceTotal(total);
    };

    const handleCreateBoth = async () => {
        try {
            // 1. Tạo người dùng
            const createdUserId = await userFormRef.current.createUser();
            if (createdUserId) {
                setUserId(createdUserId); // Lưu ID người dùng
                console.log("User created with ID:", createdUserId);

                // 3. Tạo booking
                const createdBookingId = await bookingFormRef.current.createBooking();
                if (createdBookingId) {
                    setBookingId(createdBookingId); // Lưu ID booking
                    // 2. Tạo căn cước sau khi người dùng đã được tạo
                    await identifyFormRef.current.createIdentify(createdUserId);
                    // 4. Thêm các dịch vụ đã chọn vào orderService sau khi tạo booking thành công
                    await addServiceRef.current.addService(createdBookingId);
                    console.log('Booking and services created successfully!');
                } else {
                    console.log('Booking and services not create');
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
        <div>
            <h3>Đặt phòng ngay</h3>
            <Row>
                <Col md="6">
                    {/* User Form */}
                    <AddUserForm ref={userFormRef} />

                    {/* Identification Form */}
                    <AddIdentifyForm ref={identifyFormRef} />

                    {/* Service Form */}
                    <AddServiceForm
                        ref={addServiceRef}
                        bookingId={bookingId} // Truyền ID booking sau khi được tạo
                        onServiceTotalChange={handleServiceTotalChange}  // Truyền callback xử lý tổng dịch vụ
                    />

                </Col>

                <Col>
                    {/* Booking Form */}
                    <AddBookingForm
                        ref={bookingFormRef}
                        onBookingCreated={setBookingId}
                        customerID={userId}
                        serviceAmount={serviceTotal}
                        locationId={locationId} // Pass locationId here
                    />
                    <Button className='text-bg-success fs-3 ' onClick={handleCreateBoth} >
                        Đặt Phòng Ngay
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default BookingPage;
