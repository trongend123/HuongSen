import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './dashboard.css';

const Dashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Default: Start of current year
  const [endDate, setEndDate] = useState(new Date()); // Default: Today

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

  // Filter data based on the selected date range
  const filteredBookingData = bookingData.filter((item) => {
    const date = new Date(item.createdAt);
    return date >= startDate && date <= endDate;
  });

  const filteredOrderData = orderData.filter((item) => {
    const date = new Date(item.createdAt);
    return date >= startDate && date <= endDate;
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

      {/* Date range selectors */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="startDate">
            <Form.Label>Chọn ngày bắt đầu: </Form.Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="endDate">
            <Form.Label>Chọn ngày kết thúc: </Form.Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
            />
          </Form.Group>
        </Col>
      </Row>
      <hr />
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
      <hr />
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
    </Container>
  );
};

export default Dashboard;
