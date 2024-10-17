import React from 'react';
import { Container, Carousel, Card, Button, Row, Col, Form } from 'react-bootstrap';
import Footer from '../../components/Footer/footer';
import Header from '../../components/Header/header';
import NavigationBar from '../../components/Navbar/navbar';
import './home.css';
const HomePage = () => {
  return (
    <Container fluid>
      <Header />
      <NavigationBar />
      {/* Hero Section with Carousel */}
      <section id="hero">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src="/images/hero1.jpg" alt="First slide" />
            <Carousel.Caption>
              <h3>Welcome to Huong Sen Guesthouse</h3>
              <p>Experience luxury and comfort in the heart of the city.</p>
              <Button variant="primary" href="#rooms">Explore Our Rooms</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="/images/hero2.jpg" alt="Second slide" />
            <Carousel.Caption>
              <h3>Relax and Unwind</h3>
              <p>Enjoy a peaceful stay with our top-notch facilities.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 text-center bg-light">
        <Container>
          <h2>About Us</h2>
          <p>Huong Sen Guesthouse offers you the perfect blend of luxury, comfort, and tranquility. Situated in a serene environment, our guesthouse is the ideal choice for both leisure and business travelers.</p>
        </Container>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-5">
        <Container>
          <h2 className="text-center">Our Rooms</h2>
          <Row className="mt-4">
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="/images/room1.jpg" />
                <Card.Body>
                  <Card.Title>Deluxe Room</Card.Title>
                  <Card.Text>
                    Spacious room with a king-size bed, private balcony, and garden view.
                  </Card.Text>
                  <Button variant="primary">Book Now</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="/images/room2.jpg" />
                <Card.Body>
                  <Card.Title>Family Suite</Card.Title>
                  <Card.Text>
                    Perfect for families, offering two bedrooms, a living area, and a kitchenette.
                  </Card.Text>
                  <Button variant="primary">Book Now</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="/images/room3.jpg" />
                <Card.Body>
                  <Card.Title>Standard Room</Card.Title>
                  <Card.Text>
                    Cozy and comfortable room with modern amenities for a relaxing stay.
                  </Card.Text>
                  <Button variant="primary">Book Now</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-light">
        <Container>
          <h2 className="text-center">Our Services</h2>
          <Row className="mt-4">
            <Col md={4} className="text-center">
              <img src="/icons/wifi.svg" alt="Free Wifi" />
              <h4>Free Wifi</h4>
              <p>Stay connected with complimentary high-speed internet throughout the guesthouse.</p>
            </Col>
            <Col md={4} className="text-center">
              <img src="/icons/parking.svg" alt="Parking" />
              <h4>Free Parking</h4>
              <p>Ample parking space available for our guests.</p>
            </Col>
            <Col md={4} className="text-center">
              <img src="/icons/airport.svg" alt="Airport Pickup" />
              <h4>Airport Pickup</h4>
              <p>Convenient airport pickup and drop-off services available.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-5">
        <Container>
          <h2 className="text-center">Gallery</h2>
          <Row className="mt-4">
            <Col md={3}>
              <img src="/images/gallery1.jpg" alt="Gallery Image" className="img-fluid" />
            </Col>
            <Col md={3}>
              <img src="/images/gallery2.jpg" alt="Gallery Image" className="img-fluid" />
            </Col>
            <Col md={3}>
              <img src="/images/gallery3.jpg" alt="Gallery Image" className="img-fluid" />
            </Col>
            <Col md={3}>
              <img src="/images/gallery4.jpg" alt="Gallery Image" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <Container>
          <h2 className="text-center">Contact Us</h2>
          <Row className="mt-4">
            <Col md={6}>
              <h4>Get in touch with us</h4>
              <p>For inquiries, bookings, or any other questions, feel free to reach out to us.</p>
              <ul>
                <li><strong>Phone:</strong> +84 123 456 789</li>
                <li><strong>Email:</strong> info@huongsen.com</li>
                <li><strong>Address:</strong> 123 Street, City, Vietnam</li>
              </ul>
            </Col>
            <Col md={6}>
              <h4>Send us a message</h4>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter your message" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">Send Message</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

     <Footer />
    </Container>
  );
}

export default HomePage;
