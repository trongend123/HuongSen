import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate từ react-router-dom
import axios from 'axios';

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedPayment, setUpdatedPayment] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedCheckin, setUpdatedCheckin] = useState('');
  const [updatedCheckout, setUpdatedCheckout] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locations, setLocation] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const navigate = useNavigate();

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



  const handleRowClick = async (booking) => {
    try {
      // Lấy danh sách xác thực cho khách hàng
      const response = await axios.get(`http://localhost:9999/identifycations/customer/${booking.customerId._id}`);
      const identifications = response.data;

      // Kiểm tra nếu có xác thực nào
      if (identifications.length > 0) {
        const { name, code } = identifications[0]; // Lấy thông tin từ xác thực đầu tiên

        // Cập nhật chi tiết booking bao gồm cả tên và mã xác thực
        setSelectedBookingDetails({
          ...booking,
          identifyName: name,   // Lưu tên của giấy tờ xác thực
          identifyCode: code,   // Lưu mã của giấy tờ xác thực
        });
      } else {
        // Nếu không có xác thực
        setSelectedBookingDetails(booking); // Không có thông tin identifycation
      }

      setShowDetailModal(true); // Hiển thị modal chi tiết
    } catch (error) {
      console.error("Error fetching booking details:", error);
      // Xử lý lỗi có thể thêm thông báo cho người dùng ở đây
    }
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
            <tr key={booking._id} onClick={() => handleRowClick(booking)} style={{ cursor: 'pointer' }}>
              <td>{booking.bookingId._id}</td>
              <td>{booking.customerId.fullname}</td>
              <td>{booking.roomCateId.name}</td>
              <td>{booking.quantity}</td>
              <td>{booking.quantity * booking.roomCateId.price}</td>
              <td>{formatDate(booking.bookingId.checkin)}</td>
              <td>{formatDate(booking.bookingId.checkout)}</td>
              <td>{booking.bookingId.payment}</td>
              <td>{booking.bookingId.status}</td>
              <td>
                {booking.bookingId.status !== 'Cancelled' && booking.bookingId.status !== 'Completed' && (
                  <>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện onClick của hàng
                        handleEditClick(booking);
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện onClick của hàng
                        handleCancelClick(booking);
                      }}
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

      {/* Modal for booking details */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Đặt phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBookingDetails ? (
            <>
              <p><strong>Tên Khách:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.fullname : 'Không có'}</p>
              <p><strong>Điện thoại:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.phone : 'Không có'}</p>
              <p><strong>Email:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.email : 'Không có'}</p>
              <p><strong>Ngày sinh:</strong> {selectedBookingDetails.customerId ? selectedBookingDetails.customerId.dob : 'Không có'}</p>
              <p><strong>Xác thực:</strong></p>
              <p>- Tên: {selectedBookingDetails.identifyName ? selectedBookingDetails.identifyName : 'Không có'}</p>
              <p>- Mã: {selectedBookingDetails.identifyCode ? selectedBookingDetails.identifyCode : 'Không có'}</p>
              <p><strong>Tên phòng:</strong> {selectedBookingDetails.roomCateId ? selectedBookingDetails.roomCateId.name : 'Không có'}</p>
              <p><strong>Số lượng:</strong> {selectedBookingDetails.quantity}</p>
              <p><strong>Tổng giá:</strong> {(selectedBookingDetails.quantity * (selectedBookingDetails.roomCateId ? selectedBookingDetails.roomCateId.price : 0)).toFixed(2)}</p>
              <p><strong>Checkin:</strong> {formatDate(selectedBookingDetails.bookingId.checkin)}</p>
              <p><strong>Checkout:</strong> {formatDate(selectedBookingDetails.bookingId.checkout)}</p>
            </>
          ) : (
            <p>Không có thông tin chi tiết.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigate('/updateBookingInfo', { state: { selectedBookingDetails } });
            }}
          >
            Chỉnh sửa thông tin
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListBooking;
