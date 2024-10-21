import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <Row>
          {/* Contact Information */}
          <Col md={4} className="mb-4">
            <h5>Nha khách Hương Sen</h5>
            <p>Address: Số 16 Minh Khai, Hồng bàng - TP Hải Phòng</p>
            <p>Mr Tuấn: 0904 665 538</p>
            <p>Mr Trọng - con bố Tuấn: 09161 27 446</p>
            <p>Mr Hiếu - bạn của con bố Tuấn: 038 698 6866</p>
            <p>Email: <a href="mailto:nhakhachhuongsen@gmail.com">nhakhachhuongsen@gmail.com</a></p>
          </Col>

          {/* Services Section */}
          <Col md={4} className="mb-4">
            <h5>Dịch vụ</h5>
            <ul className="list-unstyled">
              <li>Hội nghị</li>
              <li>Tiệc cưới</li>
              <li>Nhà hàng</li>
              <li>Đặt phòng</li>
              <li>Tổ chức sự kiện</li>
              <li>Dịch vụ khác</li>
            </ul>
          </Col>

          {/* Fanpage Section */}
          <Col md={4} className="mb-4">
            <h5>Fanpage</h5>
            <p>
              <a href="https://www.facebook.com/huongsen.nhakhach" target="_blank" rel="noopener noreferrer">
                https://www.facebook.com/huongsen.nhakhach
              </a>
            </p>
          </Col>
        </Row>
        <div className="text-center pt-4">
          <p>&copy; {new Date().getFullYear()} Nha khach Hương Sen. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;