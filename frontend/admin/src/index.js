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
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sideBar'; // Import the Sidebar component
import Login from './screens/Login/login';
import ChangePassword from './screens/Change Password/changepass';

// Layout wrapper to conditionally render sidebar and layout based on route
const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current path is "/login"
  const isLoginRoute = location.pathname === '/login';

  // If on the login route, render only the login content
  if (isLoginRoute) {
    return <>{children}</>;
  }

  // Otherwise, render the full layout with sidebar and content
  return (
    <div className="main-layout">
      <Sidebar /> {/* Sidebar is rendered only if not on the login route */}
      <Container fluid className="content" style={{ padding: '0px' }}>
        <div className="content-header"></div>
        <div className="body">
          {children}
        </div>
      </Container>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route
          path="*"
          element={(
            <Layout>
              <Routes>
                <Route path="/rooms" element={<ListRoom />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/bookings" element={<ListBooking />} />
                <Route path="/staffs" element={<ListStaff />} />
              </Routes>
            </Layout>
          )}
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
