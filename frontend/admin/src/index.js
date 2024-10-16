import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ListRoom from './components/listRoom';
import ListStaff from './components/listStaff';
import Dashboard from './components/dashboard';
import ListRoomCate from './components/listRoomCate';
import ListBooking from './components/listBooking';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sideBar'; // Import the Sidebar component
import CreateBookingByStaff from './components/createBookingByStaff';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="main-layout">
        <Sidebar /> {/* Use the Sidebar component here */}
        <Container fluid className="content" style={{ padding: '0px' }}>
          <div className="content-header"></div>
          <div className="body">
            <Routes>
              <Route path="/rooms" element={<ListRoom />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/bookings" element={<ListBooking />} />
              <Route path="/staffs" element={<ListStaff />} />
              <Route path="/roomCate" element={<ListRoomCate />} />
              <Route path="/createBooking" element={<CreateBookingByStaff />} />
            </Routes>
          </div>
        </Container>
      </div>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
