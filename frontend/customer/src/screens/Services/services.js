import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const services = [
  { _id: "67127d16cc979020534afd10", name: "Thuê xe máy", price: 120000, description: "Thuê 1 xe máy 1 ngày" },
  { _id: "67127d5ccc979020534afd11", name: "Đưa đón tại sân bay Cát Bi", price: 150000, description: "Một xe đưa đón tại sân bay Cát Bi" },
  { _id: "67127e6dcc979020534afd13", name: "Đặt đồ ăn xuất 100k", price: 100000, description: "Xuất ăn 100k cho 1 người" },
  { _id: "67127eb2cc979020534afd14", name: "Đặt đồ ăn xuất 150k", price: 150000, description: "Xuất ăn 150k cho 1 người" },
  { _id: "67127ec7cc979020534afd15", name: "Đặt đồ ăn xuất 200k", price: 200000, description: "Xuất ăn 200k cho 1 người" },
  { _id: "67127ed5cc979020534afd16", name: "Đặt đồ ăn xuất 300k", price: 300000, description: "Xuất ăn 300k cho 1 người" },
  { _id: "67127ee0cc979020534afd17", name: "Đặt đồ ăn xuất 400k", price: 400000, description: "Xuất ăn 400k cho 1 người" },
  { _id: "67127eeecc979020534afd18", name: "Đặt đồ ăn xuất 500k", price: 500000, description: "Xuất ăn 500k cho 1 người" },
  { _id: "67127faccc979020534afd1d", name: "Giặt đồ", price: 20000, description: "Giặt đồ tính theo kilogram, nhận đồ tại phòng" }
];

const menuItems = [
  { _id: "66f6d765285571f28087c176", foodName: "Đậu nhồi thịt, Cá kho, Canh ngao chua, Rau xào theo mùa, Cơm trắng" },
  { _id: "66f6d842285571f28087c177", foodName: "Gà rang muối, Thịt rang cháy cạnh, Củ quả luộc, Canh cua cà, Cơm trắng" },
  { _id: "66f6d879285571f28087c178", foodName: "Trứng đúc thịt, Canh cải thịt, Rau xào theo mùa, Mực nhỏ hấp, Cơm trắng" },
  { _id: "66f6d8bc285571f28087c17a", foodName: "Đậu xốt cà, Canh tổng hợp, Bò xào rau muống, Tôm rim, Cơm trắng" },
  { _id: "66f6d915285571f28087c17b", foodName: "Gà luộc, Canh riêu cua, Rau xào theo mùa, Thịt kho trứng, Cơm trắng" },
  { _id: "66f6d949285571f28087c17c", foodName: "Thịt chân giò (lưỡi) luộc, Cá mòi kho, Rau luộc theo mùa, Canh hà chua, Cơm trắng" },
  { _id: "66f6d9b1285571f28087c17d", foodName: "Đậu nhồi thịt, Canh bầu tôm, Rau luộc theo, Cá chiên, Cơm trắng" },
  { _id: "66f6da01285571f28087c17e", foodName: "Thịt kho tàu, Canh cải cá, Rau xào theo mùa, Ngao hấp, Cơm trắng" },
  { _id: "66f6daa3285571f28087c17f", foodName: "Thịt rang cháy cạnh, Canh cua cà, Rau luộc theo mùa, Bò xào cần, Cơm trắng" },
  { _id: "66f6db10285571f28087c180", foodName: "Vịt quay, Tôm rang thịt, Canh mùng tơi nấu ngao, Rau luộc theo mùa, Cơm trắng" }
];

const Services = () => {
  return (
    <Container className="services-page mt-4">
      <h1 className="text-center">Dịch Vụ</h1>
      {/* Menu Section */}
      <section className="menu-section mt-5">
        <h3 className="text-center">Menu nhà khách</h3>
        <Row>
          {menuItems.map(item => (
            <Col md={4} key={item._id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Text>{item.foodName}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      {/* Services Section */}
      <section className="services-section mt-4">
        <h3 className="text-center">Dịch vụ của chúng tôi</h3>
        <Row>
          {services.map(service => (
            <Col md={4} key={service._id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{service.name}</Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      
    </Container>
  );
};

export default Services;
