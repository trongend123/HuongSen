import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './changepass.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const password = JSON.parse(localStorage.getItem('user')).password;
    if(oldPassword !== password) {
      setError('Old password is not correct');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem('user'))._id;
      const response = await axios.put(
        `http://localhost:9999/staffs/${userId}`,
        { password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setMessage('Password changed successfully');
      navigate('/login');
    } catch (error) {
      setError('Error changing password. Please try again.');
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" className="m-auto">
            <div className="change-password__form">
              <h2>Đổi mật khẩu</h2>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </FormGroup>
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <Button className="btn secondary__btn auth__btn" type="submit">
                  Đổi mật khẩu
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ChangePassword;
