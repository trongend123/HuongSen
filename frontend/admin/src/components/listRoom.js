import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Modal, Button } from 'react-bootstrap';
import './listRoom.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component Room to display each room's basic info
const Room = ({ room, onClick }) => {
  const roomCardStyle = {
    backgroundColor: 
      room.status === 'Trống' ? '#d3d3d3' :
      room.status === 'Đã book' ? 'yellow' :
      room.status === 'Đang sử dụng' ? 'red' : 'white',
    
    color: room.status === 'Đang sử dụng' ? 'white' : 'black',
  };

  return (
    <Card 
      style={roomCardStyle} 
      className="room-card" 
      onClick={() => onClick(room)} // Trigger onClick event to show modal
    >
      <p>{room.code}</p>
      <p>{room.roomCategoryId.name}</p>
    </Card>
  );
};

// Main ListRoom component with room details modal
const ListRoom = () => {
  const [roomData, setRoomData] = useState([]);
  const [locations, setLocation] = useState([]);
  const [categories, setCategories] = useState([]); // To store available room categories
  const [selectedLocation, setSelectedLocation] = useState(''); // To store selected location
  const [selectedRoom, setSelectedRoom] = useState(null); // To store selected room details
  const [showModal, setShowModal] = useState(false); // To handle modal visibility
  const [updatedCategory, setUpdatedCategory] = useState(''); // To store updated room category
  const [updatedStatus, setUpdatedStatus] = useState(''); // To store updated room status
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch room data
    axios
      .get("http://localhost:9999/rooms")
      .then((response) => setRoomData(response.data))
      .catch((error) => console.error("Error fetching room data:", error));

    // Fetch locations (assuming you have an API to get this data)
    axios
      .get("http://localhost:9999/locations")
      .then((response) => setLocation(response.data))
      .catch((error) => console.error("Error fetching locations:", error));
    
    // Fetch room categories (assuming you have an API for this)
    axios
      .get("http://localhost:9999/roomCategories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching room categories:", error));
  }, []);

  // Filter room data based on selected location
  const filteredRooms = selectedLocation
    ? roomData.filter((room) => room.roomCategoryId.locationId === selectedLocation)
    : roomData;

  // Count rooms by status
  const statusCount = filteredRooms.reduce(
    (acc, room) => {
      if (room.status === 'Trống') acc.available += 1;
      if (room.status === 'Đã book') acc.booked += 1;
      if (room.status === 'Đang sử dụng') acc.inUse += 1;
      return acc;
    },
    { available: 0, booked: 0, inUse: 0 }
  );

  // Slice filteredRooms into different floors
  const floor5 = filteredRooms.slice(0, 15);
  const floor4 = filteredRooms.slice(15, 29);
  const floor3 = filteredRooms.slice(29, 41);
  const floor2 = filteredRooms.slice(41, 51);
  const floor1 = filteredRooms.slice(51, 67);

  // Function to handle room click (shows modal with room details)
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setUpdatedCategory(room.roomCategoryId._id); // Pre-fill with current category
    setUpdatedStatus(room.status); // Pre-fill with current status
    setShowModal(true);
  };

  // Function to handle updating the room details
  const handleUpdate = () => {
    const updatedRoom = {
      ...selectedRoom,
      roomCategoryId: updatedCategory,
      status: updatedStatus,
    };
  
    axios
      .put(`http://localhost:9999/rooms/${selectedRoom._id}`, updatedRoom)
      .then((response) => {
        // Refresh room data after update
        axios
          .get("http://localhost:9999/rooms")
          .then((res) => setRoomData(res.data))
          .catch((error) => console.error("Error fetching updated room data:", error));
  
        setShowModal(false); // Close the modal
      })
      .catch((error) => console.error("Error updating room:", error));
  };

  // Function to close modal
  const handleClose = () => setShowModal(false);

  return (
    <Container>
      <h2 className="text-center my-4">Sơ đồ phòng</h2>

      {/* Dropdown for filtering by location */}
      <Form.Group controlId="categorySelect" className="my-4">
        <Form.Label>Chọn cơ sở:</Form.Label>
        <Form.Control 
          as="select" 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Chọn cơ sở</option>
          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Display room counts by status */}
      <div className="room-status-counts mb-4">
        <p><strong>Trống:</strong> {statusCount.available}</p>
        <p><strong>Đã book:</strong> {statusCount.booked}</p>
        <p><strong>Đang sử dụng:</strong> {statusCount.inUse}</p>
      </div>

      {/* Room layout */}
      <div className="room-layout">      
        <div className="room-row" style={{ marginLeft: '240px' }}>
          {floor1.map((room) => (
            <Room key={room._id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
        <div className="room-row" style={{ marginLeft: '80px' }}>
          {floor2.map((room) => (
            <Room key={room._id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
        <div className="room-row">
          {floor3.map((room) => (
            <Room key={room._id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
        <div className="room-row">
          {floor4.map((room) => (
            <Room key={room._id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
        <div className="room-row">
          {floor5.map((room) => (
            <Room key={room._id} room={room} onClick={handleRoomClick} />
          ))}
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết phòng: {selectedRoom.code}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formRoomCategory">
              <Form.Label>Loại phòng</Form.Label>
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

            <Form.Group controlId="formRoomStatus">
              <Form.Label>Trạng thái</Form.Label>
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
      )}
    </Container>
  );
};

export default ListRoom;
