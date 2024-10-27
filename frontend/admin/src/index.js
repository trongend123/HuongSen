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
import { BrowserRouter as Router, Routes, Route, useLocation, NavLink } from 'react-router-dom';
import Sidebar from './components/sideBar'; // Import the Sidebar component
import Login from './screens/Login/login';
import ChangePassword from './screens/Change Password/changepass';
import CreateBookingByStaff from './components/createBookingByStaff';
import { RxAvatar } from "react-icons/rx";
import UpdateBookingInfo from './components/updateBookingInfo';
import HistoryBookingChange from './components/historyBookingChange';
import SaveHistory from './components/SaveHistory';

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
        <div className="content-header"><RxAvatar /><NavLink className={"nav-link"} to="/change-password">Thay đổi mật khẩu</NavLink></div>
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
        <Route path="/" element={<Login />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route
          path="*"
          element={(
            <Layout>
              <Routes>
                <Route path="/rooms" element={<ListRoom />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<ListBooking />} />
                <Route path="/staffs" element={<ListStaff />} />
                <Route path="/roomCate" element={<ListRoomCate />} />
                <Route path="/createBooking" element={<CreateBookingByStaff />} />
                <Route path="/updateBookingInfo" element={<UpdateBookingInfo />} />
                <Route path="/historyBookingChange" element={<HistoryBookingChange />} />
                <Route path="/saveHistory" element={<SaveHistory />} />


              </Routes>
            </Layout>
          )}
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
