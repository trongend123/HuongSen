import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ListRoom from './components/listRoom';
import ListStaff from './components/listStaff';
import Dashboard from './components/dashboard';
import ListBooking from './components/listBooking';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sideBar'; // Import the Sidebar component
import Login from './screens/Login/login';
import ChangePassword from './screens/Change Password/changepass';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="main-layout">
        <Sidebar /> {/* Use the Sidebar component here */}
        <Container fluid className="content" style={{padding: '0px'}}> 
        <div className="content-header">
    <button className="change-password-button" onClick={() => window.location.href = "/change-password"}>
        Change Password
    </button>
</div>
        <div className="body"><Routes>
            
            <Route path="/login" element={<Login />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path="/rooms" element={<ListRoom />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<ListBooking />} />
            <Route path="/staffs" element={<ListStaff />} />
          </Routes></div>
        </Container>
      </div>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
