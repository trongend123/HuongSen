// src/components/ListBooking.js
import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch booking data
    axios
      .get("http://localhost:9999/bookings")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách Đặt phòng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Đặt phòng</th>
            <th>Tên Khách</th>
            <th>Phòng</th>
            <th>Ngày Đặt</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.customerName}</td>
              <td>{booking.roomCode}</td>
              <td>{booking.bookingDate}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListBooking;
