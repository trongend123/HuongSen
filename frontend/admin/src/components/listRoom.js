import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './listRoom.css';
import axios from 'axios';

// Component Room để hiển thị thông tin mỗi phòng
const Room = ({ room }) => {
  // Tạo một biến để xác định màu nền dựa vào isAvailable
  const roomCardStyle = {
    backgroundColor: 
      room.status === 'Trống' ? '#d3d3d3' :
      room.status === 'Đã book' ? 'yellow' :
      room.status === 'Đang sử dụng' ? 'red' : 'white',
    
    color: room.status === 'Đang sử dụng' ? 'white' : 'black',
  };

  return (
    <Card style={roomCardStyle} className="room-card">
      <p>{room.code}</p>
      <p>{room.roomCategoryId.name}</p>
    </Card>
  );
};

// App component sử dụng RoomList
const ListRoom = () => {  
  const [roomData, setRoomData] = useState([]);
  const [locations, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(''); // To store selected category

  useEffect(() => {
    // Fetch room data
    axios
      .get("http://localhost:9999/rooms")
      .then((response) => setRoomData(response.data))
      .catch((error) => console.error("Error fetching room data:", error));

    // Fetch room categories (assuming you have an API to get this data)
    axios
      .get("http://localhost:9999/locations")
      .then((response) => setLocation(response.data))
      .catch((error) => console.error("Error fetching room categories:", error));
  }, []);

  // Filter room data based on selected category
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
    { available: 0, booked: 0, inUse: 0 } // Initialize counts to 0
  );

  // Chia filteredRooms thành các hàng, mỗi hàng có số phòng cố định
  const floor5 = filteredRooms.slice(0, 15);
  const floor4 = filteredRooms.slice(15, 29);
  const floor3 = filteredRooms.slice(29, 41);
  const floor2 = filteredRooms.slice(41, 51);
  const floor1 = filteredRooms.slice(51, 67);

  return (
    <Container>
      <h2 className="text-center my-4">Sơ đồ phòng</h2>

      {/* Dropdown for filtering by room category */}
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

      <div className="room-layout">      
        <div className="room-row" style={{ marginLeft: '240px' }}>
          {floor1.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <div className="room-row" style={{ marginLeft: '80px' }}>
          {floor2.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <div className="room-row">
          {floor3.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <div className="room-row">
          {floor4.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <div className="room-row">
          {floor5.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ListRoom;
