import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <h4>Huong Sen Guesthouse</h4>
          <p>123 Main Street, Hanoi, Vietnam</p>
          <p>Email: info@huongsen.com | Phone: +84 123 456 789</p>
        </div>
        <div className="footer-social">
          <p>Follow us:</p>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Huong Sen Guesthouse. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
