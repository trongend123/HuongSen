import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';

// Dynamically import all images from the menu folders
const importAllImages = (context) => {
  let images = {};
  context.keys().forEach((item) => {
    const key = item.replace('./', '');
    images[key] = context(item);
  });
  return images;
};

// Import images from menu folders
const menu1Images = importAllImages(require.context('../../assets/menu/menu1', false, /\.(png|jpe?g|svg)$/));
const menu2Images = importAllImages(require.context('../../assets/menu/menu2', false, /\.(png|jpe?g|svg)$/));
const menu3Images = importAllImages(require.context('../../assets/menu/menu3', false, /\.(png|jpe?g|svg)$/));
const menu4Images = importAllImages(require.context('../../assets/menu/menu4', false, /\.(png|jpe?g|svg)$/));
const menu5Images = importAllImages(require.context('../../assets/menu/menu5', false, /\.(png|jpe?g|svg)$/));
const menu6Images = importAllImages(require.context('../../assets/menu/menu6', false, /\.(png|jpe?g|svg)$/));
const menu7Images = importAllImages(require.context('../../assets/menu/menu7', false, /\.(png|jpe?g|svg)$/));
const menu8Images = importAllImages(require.context('../../assets/menu/menu8', false, /\.(png|jpe?g|svg)$/));
const menu9Images = importAllImages(require.context('../../assets/menu/menu9', false, /\.(png|jpe?g|svg)$/));
const menu10Images = importAllImages(require.context('../../assets/menu/menu10', false, /\.(png|jpe?g|svg)$/));

const menuItems = [
  {
    _id: "66f6d765285571f28087c176",
    foodName: "Đậu nhồi thịt, Cá kho, Canh ngao chua, Rau xào theo mùa, Cơm trắng",
    images: [menu1Images['dau-hu-nhoi-thit.jpg'], menu1Images['canh-ngao-chua.jpg'], menu1Images['ca-kho.jpg'],menu1Images['rau-xao.jpg'], menu1Images['com-trang.jpg']],
  },
  {
    _id: "66f6d842285571f28087c177",
    foodName: "Gà rang muối, Thịt rang cháy cạnh, Củ quả luộc, Canh cua cà, Cơm trắng",
    images: [menu2Images['ga-rang-muoi.jpg'],menu2Images['canh-cua-ca-phao.jpg'], menu2Images['thit-rang-chay-canh.jpg'], menu2Images['cu-qua-luoc.jpg'], menu2Images['com-trang.jpg']],
  },
  { _id: "66f6d879285571f28087c178", 
    foodName: "Trứng đúc thịt, Canh cải thịt, Rau xào theo mùa, Mực nhỏ hấp, Cơm trắng",
    images: [menu3Images['trung-duc-thit.png'], menu3Images['canh-cai-thit.jpg'], menu3Images['rau-xao.jpg'],menu3Images['muc-nho-hap.jpg'], menu3Images['com-trang.jpg']],
   },
  { _id: "66f6d8bc285571f28087c17a", 
    foodName: "Đậu xốt cà, Canh tổng hợp, Bò xào rau muống, Tôm rim, Cơm trắng",
    images: [menu4Images['dau-sot-ca-chua.jpg'], menu4Images['canh.jpg'], menu4Images['bo-xao-rau.jpg'],menu4Images['tom-rim.jpg'], menu4Images['com-trang.jpg']],
   },
  { _id: "66f6d915285571f28087c17b", 
    foodName: "Gà luộc, Canh riêu cua, Rau xào theo mùa, Thịt kho trứng, Cơm trắng",
    images: [menu5Images['ga-luoc.jpg'],menu5Images['canh-rieu-cua.jpg'],  menu5Images['rau-xao.jpg'],menu5Images['thit-kho-tau.jpg'], menu5Images['com-trang.jpg']],
   },
  { _id: "66f6d949285571f28087c17c", 
    foodName: "Thịt chân giò (lưỡi) luộc, Cá mòi kho, Rau luộc theo mùa, Canh hà chua, Cơm trắng",
    images: [menu6Images['chan-gio-luoc.jpg'], menu6Images['ca-moi-kho.jpg'], menu6Images['rau-xao.jpg'],menu6Images['canh-ha-chua.jpg'], menu6Images['com-trang.jpg']],
   },
  { _id: "66f6d9b1285571f28087c17d", 
    foodName: "Đậu nhồi thịt, Canh bầu tôm, Rau luộc theo, Cá chiên, Cơm trắng",
    images: [menu7Images['dau-hu-nhoi-thit.jpg'], menu7Images['canh-bau-tom.jpg'], menu7Images['rau-luoc.jpg'],menu7Images['ca-chien.jpg'], menu7Images['com-trang.jpg']],
   },
  { _id: "66f6da01285571f28087c17e", 
    foodName: "Thịt kho tàu, Canh cải cá, Rau xào theo mùa, Ngao hấp, Cơm trắng",
    images: [menu8Images['thit-kho-tau.jpg'], menu8Images['canh-cai-ca.jpg'], menu8Images['rau-xao.jpg'],menu8Images['ngao-hap.jpg'], menu8Images['com-trang.jpg']],
     },
  { _id: "66f6daa3285571f28087c17f", 
    foodName: "Thịt rang cháy cạnh, Canh cua cà, Rau luộc theo mùa, Bò xào cần tây, Cơm trắng",
    images: [menu9Images['thit-rang-chay-canh.jpg'], menu9Images['canh-cua-ca-phao.jpg'], menu9Images['rau-luoc.jpg'],menu9Images['bo-xao-can-tay.jpg'], menu9Images['com-trang.jpg']], },
  { _id: "66f6db10285571f28087c180", 
    foodName: "Vịt quay, Tôm rang thịt, Canh mùng tơi nấu ngao, Rau luộc theo mùa, Cơm trắng",
    images: [menu10Images['vit-quay.jpg'], menu10Images['tom-rang-thit.jpg'], menu10Images['canh-mung-toi-nau-ngao.jpg'],menu10Images['rau-luoc.jpg'], menu10Images['com-trang.jpg']],  }
];

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
                <Carousel>
                  {item.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={image} // Ensure the images are properly imported or linked
                        alt={`Slide ${index + 1}`}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
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
        <h3 className="text-center">Các dịch vụ khác</h3>
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
