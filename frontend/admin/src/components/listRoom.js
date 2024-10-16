import React, { useState, useEffect } from 'react';
import { Container, Form, Modal, Button, Row, Col, Card } from 'react-bootstrap';
import './listRoom.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DoSonRooms, CatBaRooms } from './rooms'; // Import child components

const ListRoom = () => {
  const [roomData, setRoomData] = useState([]);
  const [locations, setLocation] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:9999/rooms')
      .then((response) => setRoomData(response.data))
      .catch((error) => console.error('Error fetching room data:', error));

    axios
      .get('http://localhost:9999/locations')
      .then((response) => setLocation(response.data))
      .catch((error) => console.error('Error fetching locations:', error));

    axios
      .get('http://localhost:9999/roomCategories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching room categories:', error));
  }, []);

  const filteredRooms = selectedLocation
    ? roomData.filter((room) => room.roomCategoryId.locationId === selectedLocation)
    : roomData;

  // Count rooms by status
  const countRoomsByStatus = (rooms) => {
    const counts = { available: 0, booked: 0, inUse: 0 };

    rooms.forEach((room) => {
      if (room.status === 'Trống') counts.available++;
      if (room.status === 'Đã book') counts.booked++;
      if (room.status === 'Đang sử dụng') counts.inUse++;
    });

    return counts;
  };

  const roomCounts = countRoomsByStatus(filteredRooms);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setUpdatedCategory(room.roomCategoryId._id);
    setUpdatedStatus(room.status);
    setShowModal(true);
  };

  const handleUpdate = () => {
    const updatedRoom = {
      ...selectedRoom,
      roomCategoryId: updatedCategory,
      status: updatedStatus,
    };

    axios
      .put(`http://localhost:9999/rooms/${selectedRoom._id}`, updatedRoom)
      .then((response) => {
        axios
          .get('http://localhost:9999/rooms')
          .then((res) => setRoomData(res.data))
          .catch((error) => console.error('Error fetching updated room data:', error));

        setShowModal(false);
      })
      .catch((error) => console.error('Error updating room:', error));
  };

  const handleClose = () => setShowModal(false);

  return (
    <Container>
      <h2 className="text-center my-4">Sơ đồ phòng và tình trạng phòng</h2>

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

      {/* Display Room Status Counts */}
      
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng số phòng trống</Card.Title>
              <Card.Text>{roomCounts.available}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng số phòng được đặt</Card.Title>
              <Card.Text>
              {roomCounts.booked}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng số phòng đang sử dụng</Card.Title>
              <Card.Text>{roomCounts.inUse}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Conditionally Render Room Components Based on Selected Location */}
      {selectedLocation === '66f6c536285571f28087c16b' && (
        <DoSonRooms rooms={filteredRooms} onClick={handleRoomClick} />
      )}
      {selectedLocation === '66f6c59f285571f28087c16d' && (
        <CatBaRooms rooms={filteredRooms} onClick={handleRoomClick} />
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin phòng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <>
              <Form.Group controlId="categorySelect">
                <Form.Label>Loại phòng:</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedCategory}
                  onChange={(e) => setUpdatedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="statusSelect" className="mt-3">
                <Form.Label>Trạng thái phòng:</Form.Label>
                <Form.Control
                  as="select"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option value="Trống">Trống</option>
                  <option value="Đã book">Đã book</option>
                  <option value="Đang sử dụng">Đang sử dụng</option>
                </Form.Control>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListRoom;
