import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './contact.css';
import logo from '../../assets/logo.png';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [error, setError] = useState(null); // State để lưu lỗi
  const [success, setSuccess] = useState(null); // State để lưu trạng thái thành công

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset lỗi cũ
    setSuccess(null); // Reset trạng thái thành công

    const sendData = {
      hotelEmail: 'nhakhachhuongsen.business@gmail.com',
      customerName: formData.name,
      customerEmail: formData.email,
      feedback: formData.message
    };

    try {
      const response = await axios.post(`${BASE_URL}/send-feedback`, sendData);
      setSuccess('Phản hồi của bạn đã được gửi thành công!'); // Hiển thị thông báo thành công
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || // Lấy thông báo lỗi từ backend
        error.message || // Lỗi do Axios
        'Đã xảy ra lỗi, vui lòng thử lại sau.'; // Lỗi mặc định

      setError(errorMessage); // Hiển thị lỗi
    }
  };

  return (
    <Container className="contact-page-container mt-4">
      <h1>Liên hệ với chúng tôi</h1>
      <Row>
        {/* Cột trái - Thông tin liên hệ */}
        <Col md={6} className="contact-info mb-4">
          <div>
            <img src={logo} alt="Logo" style={{ width: '75%', height: 'auto', display: 'block' }} />
            <br />
            <p><strong>Address:</strong> Số 16 Minh Khai, Hồng Bàng - TP Hải Phòng</p>
            <p><strong>Lễ tân cơ sở Minh Khai:</strong> 022 5374 5766</p>
            <p><strong>Lễ tân cơ sở Đồ Sơn:</strong> 022 5386 6386</p>
            <p><strong>Lễ tân cơ sở Cát Bà:</strong> 022 5388 7381</p>
            <p><strong>Email:</strong> <a href="mailto:huongsen.16minhkhai.hp@gmail.com">huongsen.16minhkhai.hp@gmail.com</a></p>
            <p><strong>Fanpage:</strong> <a href="https://www.facebook.com/huongsen.nhakhach" target="_blank" rel="noopener noreferrer">
              https://www.facebook.com/huongsen.nhakhach
            </a></p>
          </div>
        </Col>

        {/* Cột phải - Form liên hệ */}
        <Col md={6}>
          <p>Nếu bạn có thắc mắc hoặc vấn đề cần giúp đỡ, vui lòng điền vào form bên dưới, chúng tôi sẽ cố gắng giải đáp trong thời gian sớm nhất</p>
          {error && <Alert variant="danger">{error}</Alert>} {/* Hiển thị lỗi */}
          {success && <Alert variant="success">{success}</Alert>} {/* Hiển thị thành công */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="message" className="mt-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-4">
              Gửi
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
