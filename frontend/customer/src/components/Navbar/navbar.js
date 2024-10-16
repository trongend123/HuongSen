import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './navbar.css';

const NavigationBar = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-container">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand">
          Huong Sen Guesthouse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home" className="nav-link">Home</Nav.Link>
            <Nav.Link href="#about" className="nav-link">About</Nav.Link>
            <Nav.Link href="#rooms" className="nav-link">Rooms</Nav.Link>
            <Nav.Link href="#services" className="nav-link">Services</Nav.Link>
            <Nav.Link href="#contact" className="nav-link">Contact</Nav.Link>
            <Nav.Link href="#book" className="nav-link btn-primary">Book Now</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
