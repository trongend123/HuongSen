import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './screens/Home/home';
import BookingPage from './screens/pageBookingByCustomer';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="main-layout">
        <Container fluid className="content" style={{ padding: '0px' }}>
          <div className="content-header"></div>
          <div className="body"><Routes>
            <Route path="/bookingPage" element={<BookingPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes></div>
        </Container>
      </div>
    </Router>
  </React.StrictMode>
);
