import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [locationQuery, setLocationQuery] = useState(''); // New state for location filtering
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedPayment, setUpdatedPayment] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedCheckin, setUpdatedCheckin] = useState('');
  const [updatedCheckout, setUpdatedCheckout] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocation] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/orderRooms")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));

      axios
      .get('http://localhost:9999/locations')
      .then((response) => setLocation(response.data))
      .catch((error) => console.error('Error fetching locations:', error));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setUpdatedPayment(booking.bookingId.payment);
    setUpdatedStatus(booking.bookingId.status);
    setUpdatedCheckin(booking.bookingId.checkin);
    setUpdatedCheckout(booking.bookingId.checkout);
    setShowModal(true);
  };

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

  const handleCancelClick = (booking) => {
    booking.status = "Cancelled";
    const bookingId = booking._id;
    axios
      .put(`http://localhost:9999/bookings/${bookingId}`, booking)
      .then((response) => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, bookingId: { ...booking.bookingId, status: 'Cancelled' } } : booking
          )
        );
      })
      .catch((error) => console.error("Error cancelling booking:", error));
  };

  // Sort bookings by checkin date
  const sortedBookings = bookings.sort((a, b) => new Date(b.bookingId.checkin) - new Date(a.bookingId.checkin));

  const filteredBookings = sortedBookings.filter((booking) => {
    const bookingId = booking.bookingId._id.toLowerCase();
    const customerName = booking.customerId.fullname.toLowerCase();
    const isMatchingLocation = selectedLocation ? booking.roomCateId.locationId === selectedLocation : true;

    return (
      isMatchingLocation &&
      (bookingId.includes(searchQuery.toLowerCase()) ||
        customerName.includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách Đặt phòng</h2>

      {/* Search Inputs */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Tìm kiếm theo Mã Đặt phòng hoặc Tên Khách hàng"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {/* Location Filter Input */}
      <Form.Group controlId="categorySelect" className="my-4" style={{ width: '50%' }}>
        <Form.Label>Chọn cơ sở:</Form.Label>
        <Form.Control
          as="select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Chọn cơ sở</option>
          <option value="66f6c42f285571f28087c16a">cơ sở 16 Minh Khai</option>
          <option value="66f6c536285571f28087c16b">cơ sở Đồ Sơn</option>
          <option value="66f6c59f285571f28087c16d">cơ sở Cát Bà</option>
        </Form.Control>
      </Form.Group>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Đặt phòng</th>
            <th>Tên Khách</th>
            <th>Tên phòng</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Thanh toán</th>
            <th>Trạng Thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.bookingId._id}</td>
              <td>{booking.customerId.fullname}</td>
              <td>{booking.roomCateId.name}</td>
              <td>{booking.quantity}</td>
              <td>{(booking.quantity * booking.roomCateId.price)}</td>
              <td>{formatDate(booking.bookingId.checkin)}</td>
              <td>{formatDate(booking.bookingId.checkout)}</td>
              <td>{booking.bookingId.payment}</td>
              <td>{booking.bookingId.status}</td>
              <td>
                {booking.bookingId.status !== 'Cancelled' && booking.bookingId.status !== 'Completed' && (
                  <>
                    <Button variant="warning" className="me-2" onClick={() => handleEditClick(booking)}>
                      Chỉnh sửa
                    </Button>
                    <Button variant="danger" onClick={() => handleCancelClick(booking.bookingId)}>
                      Hủy
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa Đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
             <Form.Group controlId="status" className="mt-3">
                <Form.Label>Thanh toán</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="Chưa thanh toán">Chưa thanh toán</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Yêu cầu hoàn tiền">Yêu cầu hoàn tiền</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="status" className="mt-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="In Progress">Đang thực hiện</option>
                  <option value="Completed">Đã hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                </Form.Control>
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
