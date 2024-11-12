import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './dashboard.css';

const Dashboard = () => {
  const [location, setLocation] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [filterType, setFilterType] = useState('daily'); // New state for filter type
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.role) {
      setUserRole(storedUser.role);

      // If user is 'staffds', set a default location and hide location dropdown
      if (storedUser.role === 'staff_ds') {
        setLocation('66f6c536285571f28087c16b');
      } else if (storedUser.role === 'staff_cb') {
        setLocation('66f6c59f285571f28087c16d');
      } else if (storedUser.role === 'staff_mk') {
        setLocation('66f6c5c9285571f28087c16a');
      }
    }
    axios
      .get('http://localhost:9999/orderRooms')
      .then((response) => setOrderData(response.data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu đơn hàng:', error));
  }, []);

  const formatDate = (date) => {
    switch (filterType) {
      case 'weekly':
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        return weekStart.toLocaleDateString();
      case 'monthly':
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'quarterly':
        return `Q${Math.floor(date.getMonth() / 3) + 1}/${date.getFullYear()}`;
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  };

  const aggregateBookingByDate = (data, dateField) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = formatDate(new Date(item[dateField]));
      if (!aggregated[date]) aggregated[date] = 0;
      aggregated[date] += 1;
    });
    return aggregated;
  };

  const aggregateDataByDate = (data, dateField, valueField) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = formatDate(new Date(item[dateField]));
      if (!aggregated[date]) aggregated[date] = 0;
      aggregated[date] += item[valueField];
    });
    return aggregated;
  };

  const filteredBookingData = orderData.filter((item) => {
    const date = new Date(item.bookingId.createdAt);
    const isWithinDateRange = date >= startDate && date <= endDate;
    const isLocationMatch = location ? item.roomCateId.locationId.includes(location) : true;
    return isWithinDateRange && isLocationMatch;
  });

  const filteredOrderData = orderData.filter((item) => {
    const date = new Date(item.createdAt);
    const isWithinDateRange = date >= startDate && date <= endDate;
    const isLocationMatch = location ? item.roomCateId.locationId.includes(location) : true;
    return isWithinDateRange && isLocationMatch;
  });

  const aggregatedBookings = aggregateBookingByDate(filteredBookingData, 'createdAt');
  const aggregatedOrders = aggregateBookingByDate(filteredOrderData, 'createdAt');
  const labels = [...new Set([...Object.keys(aggregatedBookings), ...Object.keys(aggregatedOrders)])].sort();

  const bookingsData = labels.map(date => aggregatedOrders[date] || 0);
  const revenueData = labels.map(date =>
    filteredBookingData
      .filter(b => formatDate(new Date(b.bookingId.createdAt)) === date && b.bookingId.status === 'Completed')
      .reduce((sum, b) => sum + b.bookingId.price, 0)
  );
  const ordersData = labels.map(date =>
    filteredOrderData
      .filter(b => formatDate(new Date(b.bookingId.createdAt)) === date && b.bookingId.status === 'Completed')
      .reduce((sum, b) => sum + b.quantity, 0)
  );
  const humansData = labels.map(date =>
    filteredOrderData
      .filter(b => formatDate(new Date(b.createdAt)) === date && b.bookingId.status === 'Completed')
      .reduce((sum, b) => sum + b.bookingId.humans, 0)
  );

  const bookingsChartData = {
    labels,
    datasets: [{ label: 'Tổng số đặt phòng', data: bookingsData, borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.2)' }]
  };

  const revenueChartData = {
    labels,
    datasets: [{ label: 'Tổng doanh thu', data: revenueData, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.2)' }]
  };

  const ordersChartData = {
    labels,
    datasets: [{ label: 'Tổng số đơn hàng', data: ordersData, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.2)' }]
  };

  const humansChartData = {
    labels,
    datasets: [{ label: 'Tổng số khách hàng', data: humansData, borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.2)' }]
  };

  return (
    <Container>
      <h2 className="text-center my-4">Bảng thống kê</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="startDate">
            <Form.Label>Chọn ngày bắt đầu:</Form.Label>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" className="form-control" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="endDate">
            <Form.Label>Chọn ngày kết thúc:</Form.Label>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" className="form-control" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="filterType">
            <Form.Label>Chọn loại bộ lọc:</Form.Label>
            <Form.Control as="select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="daily">Theo ngày</option>
              <option value="weekly">Theo tuần</option>
              <option value="monthly">Theo tháng</option>
              <option value="quarterly">Theo quý</option>
              <option value="yearly">Theo năm</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          {userRole === "admin" && (
            <Form.Group controlId="categorySelect" className="my-4" style={{ width: '50%' }}>
              <Form.Label>Chọn cơ sở:</Form.Label>
              <Form.Control
                as="select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Chọn cơ sở</option>
                <option value="66f6c42f285571f28087c16a">cơ sở 16 Minh Khai</option>
                <option value="66f6c536285571f28087c16b">cơ sở Đồ Sơn</option>
                <option value="66f6c59f285571f28087c16d">cơ sở Cát Bà</option>
              </Form.Control>
            </Form.Group>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={6}><Card className='chart'><h4 className="text-center">Tổng số đơn theo thời gian</h4><Line data={bookingsChartData} /></Card></Col>
        <Col lg={6}><Card className='chart'><h4 className="text-center">Tổng doanh thu theo thời gian</h4><Line data={revenueChartData} /></Card></Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6}><Card className='chart'><h4 className="text-center">Tổng số phòng theo thời gian</h4><Line data={ordersChartData} /></Card></Col>
        <Col lg={6}><Card className='chart'><h4 className="text-center">Tổng số khách hàng theo thời gian</h4><Line data={humansChartData} /></Card></Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
