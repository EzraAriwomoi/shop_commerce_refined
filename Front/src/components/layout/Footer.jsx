import "../../css/layoutcss/layout.css";
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>KLETOS</h2>
          <p>Find pieces that shimmer and radiate confidence, just like you.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a className="link" to="/">
                Home
              </a>
            </li>
            <li>
              <a className="link" to="/products">
                Products
              </a>
            </li>
            <li>
              <a className="link" href="/faq">
                FAQ
              </a>
            </li>
            <li>
              <a className="link" href="/contactUS">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com/kletos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com/kletos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/kletos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://pinterest.com/kletos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 KLETOS. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
