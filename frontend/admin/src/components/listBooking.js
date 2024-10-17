import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedPayment, setUpdatedPayment] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedCheckin, setUpdatedCheckin] = useState('');
  const [updatedCheckout, setUpdatedCheckout] = useState('');

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

  // Open modal for editing
  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setUpdatedPayment(booking.bookingId.payment);
    setUpdatedStatus(booking.bookingId.status);
    setUpdatedCheckin(booking.bookingId.checkin);
    setUpdatedCheckout(booking.bookingId.checkout);
    setShowModal(true);
  };

  // Handle updating the booking
  const handleUpdateBooking = () => {
    const updatedBooking = {
      ...selectedBooking,
      bookingId: {
        ...selectedBooking.bookingId,
        payment: updatedPayment,
        status: updatedStatus,
        checkin: updatedCheckin,
        checkout: updatedCheckout
      }
    };

    axios
      .put(`http://localhost:9999/bookings/${selectedBooking.bookingId._id}`, updatedBooking.bookingId)
      .then((response) => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === selectedBooking._id ? updatedBooking : booking
          )
        );
        setShowModal(false);
      })
      .catch((error) => console.error("Error updating booking:", error));
  };

  // Handle cancel booking (set status to "Cancelled")
  const handleCancelClick = (booking) => {
    booking.status = "Cancelled";

    const bookingId = booking._id;
    axios
      .put(`http://localhost:9999/bookings/${bookingId}`, 
       booking
      )
      .then((response) => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, bookingId: { ...booking.bookingId, status: 'Cancelled' } } : booking
          )
        );
      })
      .catch((error) => console.error("Error cancelling booking:", error));
  };
 

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    const bookingId = booking.bookingId._id.toLowerCase();
    const customerName = booking.customerId.fullname.toLowerCase();
    return (
      bookingId.includes(searchQuery.toLowerCase()) ||
      customerName.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách Đặt phòng</h2>

      {/* Search Input */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Tìm kiếm theo Mã Đặt phòng hoặc Tên Khách hàng"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

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
            <th>Hành động</th> {/* Added column for actions */}
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.bookingId._id}</td>
              <td>{booking.customerId.fullname}</td>
              <td>{(booking.quantity * booking.roomCateId.price)}</td>
              <td>{formatDate(booking.createdAt)}</td> {/* Format createdAt */}
              <td>{formatDate(booking.bookingId.checkin)}</td>   {/* Format checkin */}
              <td>{formatDate(booking.bookingId.checkout)}</td>  {/* Format checkout */}
              <td>{booking.bookingId.payment}</td>
              <td>{booking.bookingId.status}</td>
              <td>
                {/* Show Edit and Cancel buttons only if status is not "Cancelled" */}
                {booking.bookingId.status !== 'Cancelled' && (
                  <>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEditClick(booking)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleCancelClick(booking.bookingId)}
                    >
                      Hủy
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Booking */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Form.Group controlId="payment">
                <Form.Label>Thanh toán</Form.Label>
                <Form.Control
                  type="text"
                  value={updatedPayment}
                  onChange={(e) => setUpdatedPayment(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="status" className="mt-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="Chưa thanh toán">Chưa thanh toán</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Cancelled">Đã hủy</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="checkin" className="mt-3">
                <Form.Label>Checkin</Form.Label>
                <Form.Control
                  type="date"
                  value={updatedCheckin}
                  onChange={(e) => setUpdatedCheckin(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="checkout" className="mt-3">
                <Form.Label>Checkout</Form.Label>
                <Form.Control
                  type="date"
                  value={updatedCheckout}
                  onChange={(e) => setUpdatedCheckout(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdateBooking}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListBooking;
