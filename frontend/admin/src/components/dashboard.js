import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
// import './Dashboard.css';

const Dashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(''); // Month filter (empty string for whole year)

  useEffect(() => {
    // Fetch booking data (replace with your actual API URL)
    axios
      .get('http://localhost:9999/bookings')
      .then((response) => setBookingData(response.data))
      .catch((error) => console.error('Error fetching booking data:', error));
  }, []);

  // Function to filter data by year and month
  const filterDataByYearAndMonth = (data, year, month) => {
    return data.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const bookingYear = bookingDate.getFullYear();
      const bookingMonth = bookingDate.getMonth(); // 0 = Jan, 11 = Dec

      if (month === '') {
        // If month is empty, filter only by year
        return bookingYear === year;
      } else {
        // Filter by both year and month
        return bookingYear === year && bookingMonth === parseInt(month);
      }
    });
  };

  // Aggregation function by day if month is selected, else by month
  const aggregateDataByDayOrMonth = (filteredData, metric, isMonthly) => {
    const totalDaysOrMonths = isMonthly ? new Date(year, parseInt(month) + 1, 0).getDate() : 12;
    const totals = Array(totalDaysOrMonths).fill(0); // Initialize array for 12 months or 31 days
    filteredData.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      const index = isMonthly ? bookingDate.getDate() - 1 : bookingDate.getMonth(); // Day or Month

      if (metric === 'bookings') {
        totals[index] += 1;
      } else if (metric === 'guests') {
        totals[index] += booking.guests;
      } else if (metric === 'revenue') {
        totals[index] += booking.revenue;
      } else if (metric === 'rooms') {
        totals[index] += booking.rooms;
      }
    });
    return totals;
  };

  // Determine whether to aggregate by day or month based on the month filter
  const isMonthlyView = month !== '';

  // Filter data based on selected year and month
  const filteredData = filterDataByYearAndMonth(bookingData, year, month);

  // Aggregate data by day if a month is selected, otherwise by month
  const dailyOrMonthlyBookings = aggregateDataByDayOrMonth(filteredData, 'bookings', isMonthlyView);
  const dailyOrMonthlyGuests = aggregateDataByDayOrMonth(filteredData, 'guests', isMonthlyView);
  const dailyOrMonthlyRevenue = aggregateDataByDayOrMonth(filteredData, 'revenue', isMonthlyView);
  const dailyOrMonthlyRooms = aggregateDataByDayOrMonth(filteredData, 'rooms', isMonthlyView);

  // Define labels for the x-axis
  const labels = isMonthlyView
    ? Array.from({ length: new Date(year, parseInt(month) + 1, 0).getDate() }, (_, i) => i + 1)
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Combined chart data
  const combinedChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Bookings',
        data: dailyOrMonthlyBookings,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Total Guests',
        data: dailyOrMonthlyGuests,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Total Revenue',
        data: dailyOrMonthlyRevenue,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Total Rooms',
        data: dailyOrMonthlyRooms,
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center my-4">Dashboard</h2>

      {/* Year and Month Selectors */}
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Group controlId="yearSelect">
              <Form.Label>Năm:</Form.Label>
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2024, 2023, 2022, 2021].map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="monthSelect">
              <Form.Label>Tháng:</Form.Label>
              <Form.Control
                as="select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Cả năm</option>
                <option value="0">Tháng 1</option>
                <option value="1">Tháng 2</option>
                <option value="2">Tháng 3</option>
                <option value="3">Tháng 4</option>
                <option value="4">Tháng 5</option>
                <option value="5">Tháng 6</option>
                <option value="6">Tháng 7</option>
                <option value="7">Tháng 8</option>
                <option value="8">Tháng 9</option>
                <option value="9">Tháng 10</option>
                <option value="10">Tháng 11</option>
                <option value="11">Tháng 12</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Summary Cards */}
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text>{filteredData.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Guests</Card.Title>
              <Card.Text>{dailyOrMonthlyGuests.reduce((a, b) => a + b, 0)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>${dailyOrMonthlyRevenue.reduce((a, b) => a + b, 0).toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Rooms</Card.Title>
              <Card.Text>{dailyOrMonthlyRooms.reduce((a, b) => a + b, 0)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Combined Line Chart */}
      <Row className="mt-4">
        <Col>
          <h4 className="text-center">
            {month === ''
              ? `Yearly Metrics for ${year}`
              : `Daily Metrics for ${Number(month) + 1}, ${year}`}
          </h4>
          <Line data={combinedChartData} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
