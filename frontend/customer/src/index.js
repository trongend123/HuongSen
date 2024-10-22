import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './screens/Home/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer/footer';
import Header from './components/Header/header';
import NavigationBar from './components/Navbar/navbar';
import BookingMinhKhai from './screens/locations/minhkhai';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <NavigationBar />
    <Router>
      <div className="main-layout">
        <Container fluid className="content" style={{padding: '0px'}}> 
        <div className="content-header"></div>
        <div className="body"><Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/cs1" element={<BookingMinhKhai/>} />
          </Routes></div>
        </Container>
      </div>
    </Router>
    <Footer />
  </React.StrictMode>
);
