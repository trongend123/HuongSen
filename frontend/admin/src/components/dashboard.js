import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'react-datepicker/dist/react-datepicker.css';
import './dashboard.css';
import { format } from 'date-fns';

// Your existing component
const Dashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [userRole, setUserRole] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [selectedLocation, setSelectedLocation] = useState('');
  useEffect(() => {
    const storedUser = user
    if (storedUser && storedUser.role) {
      setUserRole(storedUser.role);

      // If user is 'staffds', set a default location and hide location dropdown
      if (storedUser.role === 'staff_ds') {
        setSelectedLocation('66f6c536285571f28087c16b');
      }else if (storedUser.role === 'staff_cb') {
        setSelectedLocation('66f6c59f285571f28087c16d');
      }else if (storedUser.role === 'staff_mk') {
        setSelectedLocation('66f6c5c9285571f28087c16a');
      }
    }
    axios
    .get('http://localhost:9999/orderRooms')
    .then((response) => setOrderData(response.data))
    .catch((error) => console.error('Error fetching order data:', error));
   
    
    
  }, []);
  const filteredOrderData = orderData.filter((order) => {
    const matchesLocation = selectedLocation ? order.roomCateId.locationId === selectedLocation : true;
    const matchesStatus = order.bookingId.status === 'Completed';
    return matchesLocation && matchesStatus;
  });
  

  const bookings = filteredOrderData.map((order) => order.bookingId); 
  const uniqueBookings = Array.from(new Set(bookings.map(booking => JSON.stringify(booking))))
    .map(item => JSON.parse(item));
    
  // Grouping and aggregating data
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  // Grouping and aggregating data
  const aggregateData = (data) => {
    const aggregated = data.reduce((acc, order) => {
      // Ensure updatedAt is valid before using it
      if (order.updatedAt && isValidDate(order.updatedAt)) {
        const formattedDate = format(new Date(order.updatedAt), 'dd/MM/yyyy');

        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            date: formattedDate,
            quantity: 0,
            price: 0,
            humans: 0,
          };
        }

        acc[formattedDate].quantity += order.quantity || 0;
        acc[formattedDate].price += order.price || 0;
        acc[formattedDate].humans += order.humans || 0;
      }

      return acc;
    }, {});

    return Object.values(aggregated).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-')); // Convert 'dd/MM/yyyy' to 'yyyy-MM-dd'
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB; // Ascending order
    });
  };

  // Aggregated data for the charts
  const aggregatedOrderData = aggregateData(filteredOrderData);
  const aggregatedBookings = aggregateData(uniqueBookings);
  
  const labels = aggregatedOrderData.map((item) => item.date);
  const bookingsData = aggregatedOrderData.map((item) => item.quantity);
  const revenueData = aggregatedBookings.map((item) => item.price);
  const ordersData = aggregatedBookings.map(() => 1); // Count orders
  const humansData = aggregatedBookings.map((item) => item.humans);
  // Chart data configuration
  const bookingsChartData = {
    labels,
    datasets: [
      {
        label: 'Tổng số phòng',
        data: bookingsData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const revenueChartData = {
    labels,
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: revenueData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const ordersChartData = {
    labels,
    datasets: [
      {
        label: 'Tổng số đặt phòng',
        data: ordersData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const humansChartData = {
    labels,
    datasets: [
      {
        label: 'Tổng số khách hàng',
        data: humansData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center my-4">Bảng thống kê</h2>
      {userRole !== 'staff_ds' && userRole !== 'staff_cb' && userRole !== 'staff_mk' && (
  <Form.Group controlId="locationSelect">
    <Form.Label>Chọn địa điểm</Form.Label>
    <Form.Control
      as="select"
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
    >
      <option value="">Tất cả địa điểm</option>
      <option value="66f6c5c9285571f28087c16a">Cơ sở Minh Khai</option>
      <option value="66f6c536285571f28087c16b">Cơ sở Đồ Sơn</option>
      <option value="66f6c59f285571f28087c16d">Cơ sở Cát Bà</option>
    </Form.Control>
  </Form.Group>
)}
      <Row className="mt-4">
        <Col lg={6}>
          <Card className="chart">
            <h4 className="text-center">Tổng số phòng theo thời gian</h4>
            <Line data={bookingsChartData} />
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart">
            <h4 className="text-center">Tổng doanh thu theo thời gian</h4>
            <Line data={revenueChartData} />
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6}>
          <Card className="chart">
            <h4 className="text-center">Tổng số đơn theo thời gian</h4>
            <Line data={ordersChartData} />
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="chart">
            <h4 className="text-center">Tổng số khách hàng theo thời gian</h4>
            <Line data={humansChartData} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;