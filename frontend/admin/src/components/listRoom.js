import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
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
          <p>{room.name}</p>
      </Card>
    
  );
};

// App component sử dụng RoomList
const ListRoom = () => {  
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/rooms")
      .then((response) => setRoomData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Chia roomData thành các hàng, mỗi hàng có số phòng cố định
  const floor5 = roomData.slice(0, 15);
  const floor4 = roomData.slice(15, 29);
  const floor3 = roomData.slice(29, 41);
  const floor2 = roomData.slice(41, 51);
  const floor1 = roomData.slice(51, 67);

  return (
    <Container>
      <h2 className="text-center my-4">Sơ đồ phòng tại cơ sở: Đồ Sơn</h2>
      <div className="room-layout">      
          <div className="room-row" style={{marginLeft: '240px'}}>
            {floor1.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </div>
          <div className="room-row" style={{marginLeft: '80px'}}>
            {floor2.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </div>
          <div className="room-row" >
            {floor3.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </div>
          <div className="room-row" >
            {floor4.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </div>
          <div className="room-row" >
            {floor5.map((room) => (
              <Room key={room.id} room={room} />
            ))}
          </div>
       
      </div>
    </Container>
  );
};

export default ListRoom;
