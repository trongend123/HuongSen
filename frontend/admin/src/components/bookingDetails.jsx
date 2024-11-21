import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./bookingDetails.css";
import { Col, Container, Row } from 'react-bootstrap';
const BookingDetails = () => {
    const { bookingId } = useParams();
    const [orderRooms, setOrderRooms] = useState([]);
    const [identification, setIdentifications] = useState([]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const orderRoomsResponse = await axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`);
                const OR = orderRoomsResponse.data;
                setOrderRooms(OR);
            } catch (error) {
                console.error('Error fetching booking details:', error);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    useEffect(() => {
        if (orderRooms.customerId) {
            const fetchIdentifyDetails = async () => {
                try {
                    const identificationsResponse = await axios.get(`http://localhost:9999/identifycations/customer/${orderRooms[0].customerId._id}`);
                    const IR = identificationsResponse.data;
                    setIdentifications(IR);
                } catch (error) {
                    console.error('Error fetching identification details:', error);
                }
            };

            fetchIdentifyDetails();
        }
    }, [orderRooms]);

    if (orderRooms.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="booking-details">
            <h2>Thông tin Đặt phòng</h2>
            <h3>Mã Đặt phòng: {orderRooms[0].bookingId?._id || 'N/A'} - Mã hợp đồng: {orderRooms[0].bookingId?.contract || 'N/A'}</h3>

            <section className="customer-info">
            <h4>Thông tin Khách hàng</h4>
                <Row>
                <Col md={3}>
                <p><strong>Họ và tên:</strong> {orderRooms[0].customerId?.fullname || 'N/A'}</p>

                </Col>
                <Col md={3}>
                <p><strong>Ngày sinh:</strong> {formatDate(orderRooms[0].customerId?.dob)}</p>
                </Col>
                <Col md={3}>
                <p><strong>Số điện thoại:</strong> {orderRooms[0].customerId?.phone || 'N/A'}</p>
                </Col>
                <Col md={3}>
                <p><strong>Giới tính:</strong> {orderRooms[0].customerId?.gender || 'N/A'}</p>
                </Col>
                </Row>
                <Row>
                    <Col md={4}>
                    <p><strong>Email:</strong> {orderRooms[0].customerId?.email || 'N/A'}</p>
                    </Col>
                    <Col md={4}>
                    Số định danh:
                    </Col>
                    <Col md={4}>
                    <p><strong>Địa chỉ:</strong> {orderRooms[0].customerId?.address || 'N/A'}</p>
                    </Col>
                </Row>
            </section>

            {orderRooms.map((orderRoom) => (
                <div
                    key={orderRoom._id}
                    className="room-details"
                >
                    <section className="room-info">
                        <h4>Thông tin Phòng</h4>
                        <p><strong>Tên phòng:</strong> {orderRoom.roomCateId?.name || 'N/A'}</p>
                        <p><strong>Số giường:</strong> {orderRoom.roomCateId?.numberOfBed || 'N/A'}</p>
                        <p><strong>Số người tối đa:</strong> {orderRoom.roomCateId?.numberOfHuman || 'N/A'}</p>
                        <p><strong>Giá:</strong> {orderRoom.roomCateId?.price ? `${orderRoom.roomCateId.price} VND` : 'N/A'}</p>
                        <p><strong>Vị trí:</strong> {orderRoom.roomCateId?.locationId || 'N/A'}</p>
                        <p><strong>Số lượng:</strong> {orderRoom.quantity || 'N/A'}</p>
                    </section>
                </div>
            ))}

            <section className="booking-info">
                <h4>Thông tin Đặt phòng</h4>
                <p><strong>Trạng thái:</strong> {orderRooms[0].bookingId?.status || 'N/A'}</p>
                <p><strong>Thanh toán:</strong> {orderRooms[0].bookingId?.payment || 'N/A'}</p>
                <p><strong>Giá:</strong> {orderRooms[0].bookingId?.price ? `${orderRooms[0].bookingId.price} VND` : 'N/A'}</p>
                <p><strong>Check-in:</strong> {formatDate(orderRooms[0].bookingId?.checkin)}</p>
                <p><strong>Check-out:</strong> {formatDate(orderRooms[0].bookingId?.checkout)}</p>
                <p><strong>Ghi chú:</strong> {orderRooms[0].bookingId?.note || 'N/A'}</p>
            </section>

            
        </div>
    );
};

export default BookingDetails;
