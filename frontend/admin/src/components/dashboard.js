import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './dashboard.css';

const Dashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed

  useEffect(() => {
    // Fetch booking data
    axios
      .get('http://localhost:9999/bookings')
      .then((response) => setBookingData(response.data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu đặt phòng:', error));
  }, []);

  useEffect(() => {
    // Fetch order data
    axios
      .get('http://localhost:9999/orderRooms')
      .then((response) => setOrderData(response.data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu đơn hàng:', error));
  }, []);

  const aggregateBookingByDate = (data, dateField) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = new Date(item[dateField]).toLocaleDateString();
      if (!aggregated[date]) {
        aggregated[date] = 0;
      }
      aggregated[date] += 1; // Summing specific value field
    });
    return aggregated;
  };

  const aggregateDataByDate = (data, dateField, valueField) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = new Date(item[dateField]).toLocaleDateString();
      if (!aggregated[date]) {
        aggregated[date] = 0;
      }
      aggregated[date] += item[valueField]; // Summing specific value field
    });
    return aggregated;
  };

  // Filter data based on selected year and month
  const filteredBookingData = bookingData.filter((item) => {
    const date = new Date(item.createdAt);
    return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
  });

  const filteredOrderData = orderData.filter((item) => {
    const date = new Date(item.createdAt);
    return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
  });

  const aggregatedBookings = aggregateBookingByDate(filteredBookingData, 'createdAt');
  const aggregatedOrders = aggregateDataByDate(filteredOrderData, 'createdAt', 'quantity');

  // Create labels for the charts
  const labels = [...new Set([...Object.keys(aggregatedBookings), ...Object.keys(aggregatedOrders)])].sort();

  // Data for each chart
  const bookingsData = labels.map(date => aggregatedBookings[date] || 0);
  const revenueData = labels.map(date => filteredBookingData.filter(b => new Date(b.createdAt).toLocaleDateString() === date && b.status === 'Completed').reduce((sum, b) => sum + b.price, 0));
  const ordersData = labels.map(date => aggregatedOrders[date] || 0);

  // Chart data for bookings
  const bookingsChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tổng số đặt phòng',
        data: bookingsData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: revenueData,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  // Chart data for orders
  const ordersChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tổng số đơn hàng',
        data: ordersData,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center my-4">Bảng thống kê</h2>

      {/* Year and Month Selectors */}
      <Row className="mb-4" style={{width:'500px'}}>
        <Col md={6}>
          <Form.Group controlId="yearSelect">
            <Form.Label>Chọn Năm</Form.Label>
            <Form.Control
              as="select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="monthSelect">
            <Form.Label>Chọn Tháng</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <hr/>          
      {/* Summary Cards */}
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng số đặt phòng</Card.Title>
              <Card.Text>{filteredBookingData.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng doanh thu</Card.Title>
              <Card.Text>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  filteredBookingData.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.price, 0)
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng số phòng</Card.Title>
              <Card.Text>{filteredOrderData.reduce((sum, order) => sum + order.quantity, 0)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr/>                 
      {/* Individual Line Charts */}
      <Row className="mt-4">
        <Col lg={4}>
        <Card className='chart'>
          <h4 className="text-center">Tổng số đơn theo thời gian</h4>
          <Line data={bookingsChartData} />
        </Card>
        </Col>
        <Col lg={4}>
        <Card className='chart'>
          <h4 className="text-center">Tổng doanh thu theo thời gian</h4>
          <Line data={revenueChartData} />
        </Card>
        </Col>
        <Col lg={4}>
        <Card className='chart'>
          <h4 className="text-center">Tổng số phòng theo thời gian</h4>
          <Line data={ordersChartData} />
        </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        
      </Row>
      <Row className="mt-4">
        
      </Row>
    </Container>
  );
};

export default Dashboard;
