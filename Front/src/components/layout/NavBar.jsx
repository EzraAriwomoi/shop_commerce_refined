import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate  } from "react-router-dom";
import { FaShoppingCart, FaBell, FaUser, FaBars } from "react-icons/fa";
import CustomerAuthComponent from "../customerauthcomponents/CustomerAuthComponent";
import "../../css/layoutcss/layout.css";
import axios from 'axios';

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleDropdown = (setter) => {
    setter((prev) => !prev);
  };

  const handleSignOut = async () => {
    setIsSignInVisible(false);
    setProfileOpen(false);

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        alert('Logged out successfully');
        navigate('/');
        window.location.reload();
        setIsAuthenticated(false);
      // setIsAuthenticated(false);
    } else {
      const data = await response.json();
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Logout failed: ' + error.message);
  }
  };

  const handleSignInClick = () => {
    setIsSignInVisible(true);
    setProfileOpen(false);
  };

  const handleCartClick = () => {
    window.location.href = "/shoppingcart";
  };

  const closeSignInModal = () => {
    setIsSignInVisible(false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();

    const handleClickOutside = (event) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationsRef.current && !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">
          <h3>KLETOS</h3>
        </a>
      </div>

      <div className="mobile-view">
        <div
          className="mobile-bell-icon"
          onClick={() => setNotificationOpen(!notificationOpen)}
        >
          <FaBell />
          {notificationOpen && <NotificationMenu />}
        </div>
        <div className="mobile-cart-icon" onClick={handleCartClick}>
          <FaShoppingCart />
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      <div className={`navbar-content ${mobileMenuOpen ? "active" : ""}`}>
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/aboutus">About</a></li>
          <li><a href="/contactus">Contact</a></li>
        </ul>
        <div className="navbar-icons">
          <div className="dropdown">
            <button
              onClick={handleCartClick}
              className="icon-button"
            >
              <FaShoppingCart />
            </button>
          </div>
          <div className="dropdown" ref={notificationsRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="icon-button"
            >
              <FaBell />
            </button>
            {notificationOpen && <NotificationMenu />}
            {notificationsOpen && (
              <div className="dropdown-content">
                <Link to="/notifications">All Notifications</Link>
                <a href="#">Mark All as Read</a>
              </div>
            )}
          </div>
          <div className="dropdown" ref={profileRef}>
            <button
              onClick={() => toggleDropdown(setProfileOpen)}
              className="icon-button"
            >
              <FaUser />
            </button>
            {profileOpen && (
              <div className="dropdown-content">
                <Link to="/myaccount">My Profile</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/settings">Settings</Link>
                    <a href="#" onClick={handleSignOut}>Logout</a>
                  </>
                ) : (
                  <a className="signin-button" href="#" onClick={handleSignInClick}>Sign in</a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSignInVisible && <CustomerAuthComponent onClose={closeSignInModal} />}
    </nav>
  );
};

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState([
    { productName: "Ring", prodcutId: 1, timeStamp: "12am", imageSrc: "/ring.jpeg" },
    { productName: "Ring", prodcutId: 1, timeStamp: "12am", imageSrc: "/ring.jpeg" },
    { productName: "Ring", prodcutId: 1, timeStamp: "12am", imageSrc: "/ring.jpeg" },
  ]);

  return (
    <div className="notification-menu">
      <ul className="notf-cont">
        {notifications.map((a, index) => (
          <a href="#" className="notf-box" key={index}>
            <div className="nb-image">
              <img src={a.imageSrc} alt={a.productName} />
            </div>
            <div className="nb-details">
              <h3>{a.productName}</h3>
              <p>{a.timeStamp}</p>
            </div>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
