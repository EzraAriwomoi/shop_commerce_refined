// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBell, FaUser, FaBars } from "react-icons/fa";
import CustomerAuthComponent from "../customerauthcomponents/CustomerAuthComponent";
import "../../css/layoutcss/layout.css";
import axios from 'axios';

const NOTIFICATIONS_API_URL = "http://127.0.0.1:5000/notifications/";
const CART_COUNT_API_URL = "http://127.0.0.1:5000/cart/count";

const Navbar = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInVisible, setIsSignInVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [noNotifications, setNoNotifications] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(NOTIFICATIONS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          setNoNotifications(true);
          setNotifications([]);
        } else {
          setNotifications(response.data);
          setNoNotifications(false);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    // Function to fetch cart count
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(CART_COUNT_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCartCount(response.data.count);
          updateBadgePadding(response.data.count);
        }
      } catch (error) {
        console.error("Error fetching cart count", error);
      }
    };

    fetchNotifications();
    fetchCartCount();

    // Set up polling for cart count
    const intervalId = setInterval(fetchCartCount, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [isSignInVisible]);

  const updateBadgePadding = (count) => {
    if (count > 9) {
      document.documentElement.style.setProperty('--badge-padding', '0.2em 0.35em');
      document.documentElement.style.setProperty('--badge-padding-mobile', '0.2em 0.35em');
    } else {
      document.documentElement.style.setProperty('--badge-padding', '0.2em 0.55em');
      document.documentElement.style.setProperty('--badge-padding-mobile', '0.2em 0.55em');
    }
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
  };

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
    navigate("/shoppingcart");
  };

  const handleProfileClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handleSignInClick();
    }
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
          headers: {
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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
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
        <Link to="/">
          <h3>KLETOS</h3>
        </Link>
      </div>

      <div className="mobile-view">
        <div
          className="mobile-bell-icon"
          onClick={handleNotificationsClick}
        >
          <FaBell />
          {notificationsOpen && <NotificationMenu notifications={notifications} noNotifications={noNotifications} />}
        </div>
        <div className="mobile-cart-icon" onClick={handleCartClick}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      <div className={`navbar-content ${mobileMenuOpen ? "active" : ""}`}>
        {mobileMenuOpen ? (
          <div className="dropdown-content-mobileview">
            <Link className="link-to" onClick={handleProfileClick} to="/myaccount">Profile</Link>
            {isAuthenticated ? (
              <>
                <Link className="link-to" to="/products">Products</Link>
                <Link className="link-to" to="/orders">Orders</Link>
                <Link className="link-to" to="/wishlist">Wishlist</Link>
                <div className="dropdown-divider-mobile"></div>
                <a href="#" onClick={handleSignOut}>Logout</a>
              </>
            ) : (
              <>
                <div className="dropdown-divider-mobile"></div>
                <a href="#" onClick={handleSignInClick}>Sign in</a>
              </>
            )}
          </div>
        ) : (
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/aboutus">About</Link></li>
            <li><Link to="/contactus">Contact</Link></li>
          </ul>
        )}
        <div className="navbar-icons">
          <div className="dropdown">
            <button
              onClick={handleCartClick}
              className="icon-button"
            >
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
          <div className="dropdown" ref={notificationsRef}>
            <button
              onClick={handleNotificationsClick}
              className="icon-button"
            >
              <FaBell />
            </button>
            {notificationsOpen && <NotificationMenu notifications={notifications} noNotifications={noNotifications} />}
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
                <Link onClick={handleProfileClick} to="/myaccount">Profile</Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/orders">Orders</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <div className="dropdown-divider"></div>
                    <a href="#" onClick={handleSignOut}>Logout</a>
                  </>
                ) : (
                  <>
                    <div className="dropdown-divider"></div>
                    <a href="#" onClick={handleSignInClick}>Sign in</a>
                  </>
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

const NotificationMenu = ({ notifications, noNotifications }) => {
  if (noNotifications) {
    return (
      <div className="notification-menu">
        <p>No notifications available</p>
      </div>
    );
  }

  return (
    <div className="notification-menu">
      <ul className="notf-cont">
        {notifications.map((notification) => (
          <a href="#" className="notf-box" key={notification.id}>
            <div className="nb-details">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <p><small>{new Date(notification.created_at).toLocaleString()}</small></p>
            </div>
          </a>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
