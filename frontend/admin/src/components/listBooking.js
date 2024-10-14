// src/components/ListBooking.js
import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch booking data
    axios
      .get("http://localhost:9999/orderRooms")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách Đặt phòng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Đặt phòng</th>
            <th>Tên Khách</th>
            <th>Tổng tiền</th>
            <th>Ngày Đặt</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Thanh toán</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.bookingId._id}</td>
              <td>{booking.customerId.fullname}</td>
              <td>{(booking.quantity * booking.roomCateId.price)}</td>
              <td>{formatDate(booking.createdAt)}</td> {/* Format createdAt */}
              <td>{formatDate(booking.bookingId.checkin)}</td>   {/* Format checkin */}
              <td>{formatDate(booking.bookingId.checkout)}</td>  {/* Format checkout */}
              <td>{booking.bookingId.payment}</td>
              <td>{booking.bookingId.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListBooking;
