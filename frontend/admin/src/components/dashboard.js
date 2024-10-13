// src/components/Dashboard.js
import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container>
      <h2 className="text-center my-4">Dashboard</h2>
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Phòng trống</Card.Title>
              <Card.Text>10</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Phòng đã đặt</Card.Title>
              <Card.Text>5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Phòng đang sử dụng</Card.Title>
              <Card.Text>8</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
