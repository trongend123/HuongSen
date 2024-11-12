
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './screens/Home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import CS1 from './screens/locations/CS1/cs1';
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import NavigationBar from './components/Navbar/navbar';
import CS2 from './screens/locations/CS2/cs2';
import CS3 from './screens/locations/CS3/cs3';
import TourIntro from './screens/Tour/tour';
import CustomerBookingPage from './screens/pageCusInfoBooking';
import SaveHistory from './components/SaveHistory';
import PaymentSuccess from './screens/Success/success';
import PaymentCancel from './screens/CancelBooking/cancel';
import Feedback from "./screens/Feedback/feedback";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div className="main-layout">
        <Header />
        <NavigationBar />
        <Container fluid className="content" style={{ padding: '0px' }}>
          <div className="content-header"></div>
          <div className="body"><Routes>

            <Route path="/" element={<HomePage />} />
            <Route path="/cs1" element={<CS1 />} />
            <Route path="/cs2" element={<CS2 />} />
            <Route path="/cs3" element={<CS3 />} />
            <Route path="/tours" element={<TourIntro />} />
            <Route path="/saveHistory" element={<SaveHistory />} />
            <Route path="/customerBooking/:locationId" element={<CustomerBookingPage />} />
            <Route path="/success" component={PaymentSuccess} />
            <Route path="/cancel" component={PaymentCancel} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes></div>
        </Container>
        <Footer />
      </div>
    </Router>
  </React.StrictMode>
);
