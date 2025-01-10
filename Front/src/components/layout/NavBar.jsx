/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBell, FaUser, FaBars } from "react-icons/fa";
import CustomerAuthComponent from "../customerauthcomponents/CustomerAuthComponent";
import "../../css/layoutcss/layout.css";
import axios from 'axios';

const NOTIFICATIONS_API_URL = "https://back-server-1.onrender.com/notifications/";
const CART_COUNT_API_URL = "https://back-server-1.onrender.com/cart/count";

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
  const mobileMenuRef = useRef(null);
  const fabarsRef = useRef(null);

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

    // Refresh the cart count number after every 1sec
    const intervalId = setInterval(fetchCartCount, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [isSignInVisible]);

  // Cart count number batch to shange shape when item in cart is greater than 9
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
    if (isAuthenticated) {
      setNotificationsOpen(!notificationsOpen);
    }
    else
      setIsSignInVisible(true);
  };

  const toggleDropdown = (setter) => {
    setter((prev) => !prev);
  };

  const handleSignOut = async () => {
    setIsSignInVisible(false);
    setProfileOpen(false);

    // Backend code to logout from website
    try {
      const response = await fetch('https://back-server-1.onrender.com/auth/logout', {
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

      // Backend code to check if the user is signed in
      try {
        const response = await axios.get('https://back-server-1.onrender.com/auth/status', {
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !fabarsRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFaBarsClick = () => {
    setMobileMenuOpen((prev) => !prev);
  };

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
          ref={notificationsRef}
        >
          <FaBell title="notifications" />
          {notificationsOpen && <NotificationMenu notifications={notifications} noNotifications={noNotifications} />}
        </div>
        <div className="mobile-cart-icon" onClick={handleCartClick}>
          <FaShoppingCart title="cart" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
        <button
          className="mobile-menu-button"
          onClick={handleFaBarsClick}
          ref={fabarsRef}
        >
          <FaBars />
        </button>
      </div>

      <div className={`navbar-content ${mobileMenuOpen ? "active" : ""}`} ref={mobileMenuRef}>
        {mobileMenuOpen ? (
          <div className="dropdown-content-mobileview">
            {isAuthenticated ? (
              <>
                <Link to="/" className="link-to">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="icon-drop">
                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                  </svg>
                  Home
                </Link>

                <Link className="link-to" to="/orders">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="icon-drop">
                    <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z" />
                  </svg>
                  Orders
                </Link>

                <Link className="link-to" to="/wishlist">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                  </svg>
                  Wishlist
                </Link>

                <Link to="/contactus" className="link-to">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                  </svg>
                  Contact Us
                </Link>

                <Link onClick={handleProfileClick} to="/myaccount" className="link-to profile-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 64c53 0 96 43 96 96s-43 96-96 96-96-43-96-96 43-96 96-96zm0 416c-70.7 0-133.1-39.3-164.3-97.5 12.8-24.8 37.8-42.5 66.7-42.5h195.2c28.9 0 53.9 17.7 66.7 42.5C389.1 440.7 326.7 480 256 480z" />
                  </svg>
                  Profile
                </Link>

                <div className="dropdown-divider-mobile"></div>
                <a href="#" className="logout-signin-mobile" onClick={handleSignOut}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                  </svg>
                  Logout
                </a>
              </>
            ) : (
              <>
                <Link to="/" className="link-to">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="icon-drop">
                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                  </svg>
                  Home
                </Link>

                <Link onClick={handleProfileClick} to="/myaccount" className="link-to profile-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 64c53 0 96 43 96 96s-43 96-96 96-96-43-96-96 43-96 96-96zm0 416c-70.7 0-133.1-39.3-164.3-97.5 12.8-24.8 37.8-42.5 66.7-42.5h195.2c28.9 0 53.9 17.7 66.7 42.5C389.1 440.7 326.7 480 256 480z" />
                  </svg>
                  Profile
                </Link>

                <div className="dropdown-divider-mobile"></div>
                <a href="#" className="logout-signin-mobile" onClick={handleSignInClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                  </svg>
                  Sign in
                </a>
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
              <FaShoppingCart title='cart' />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
          <div className="dropdown" ref={notificationsRef}>
            <button
              onClick={handleNotificationsClick}
              className="icon-button"
            >
              <FaBell title='notifications' />
            </button>
            {notificationsOpen && <NotificationMenu notifications={notifications} noNotifications={noNotifications} />}
          </div>
          <div className="dropdown" ref={profileRef}>
            <button
              onClick={() => toggleDropdown(setProfileOpen)}
              className="icon-button"
            >
              <FaUser title='profile' />
            </button>
            {profileOpen && (
              <div className="dropdown-content">
                <Link onClick={handleProfileClick} to="/myaccount" className="link-to profile-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 64c53 0 96 43 96 96s-43 96-96 96-96-43-96-96 43-96 96-96zm0 416c-70.7 0-133.1-39.3-164.3-97.5 12.8-24.8 37.8-42.5 66.7-42.5h195.2c28.9 0 53.9 17.7 66.7 42.5C389.1 440.7 326.7 480 256 480z" />
                  </svg>
                  Profile
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link className="link-to" to="/orders">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="icon-drop">
                        <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z" />
                      </svg>
                      Orders
                    </Link>
                    <Link className="link-to" to="/wishlist">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                        <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                      </svg>
                      Wishlist
                    </Link>
                    <div className="dropdown-divider"></div>
                    <a href="#" onClick={handleSignOut}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                      </svg>
                      Logout
                    </a>
                  </>
                ) : (
                  <>
                    <div className="dropdown-divider"></div>
                    <a href="#" className="logout-signin-mobile" onClick={handleSignInClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon-drop">
                        <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                      </svg>
                      Sign in
                    </a>
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
