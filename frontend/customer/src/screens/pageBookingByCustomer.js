import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBookingForm from '../components/bookingRoom/addBookingForm';
import { Col, Row, Button } from 'react-bootstrap';

const CustomerPage = ({ locationId }) => {
    const bookingFormRef = useRef(null);
    const navigate = useNavigate();
    const [canInput] = useState(false);

    const handleCreateBoth = async () => {
        try {
            // Perform any necessary operations before navigation
            navigate(`/customerBooking/${locationId}`);
        } catch (error) {
            console.error('Error creating user, identification, or booking:', error);
            alert('An error occurred during creation.');
        }
    };

    return (
        <div>
            <Row>
                <Col>
                    {/* Booking Form */}
                    <AddBookingForm
                        ref={bookingFormRef}
                        locationId={locationId}
                        canInput={false}
                    />
                    <Button className="text-bg-success fs-3" onClick={handleCreateBoth}>
                        Đặt Phòng Ngay
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerPage;
