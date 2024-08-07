// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/myaccount/myaccount.css";
import MyAccount from "./subcomponents/myaccount";
import OrderHistory from "./subcomponents/orderhistory";
import SavedItems from "./subcomponents/wishlist";
import NavBar from "../../components/layout/NavBar";

export default function MainAccount() {
  const [isMobileMenuOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("orderhistory");
  const [userDetails, setUserDetails] = useState({ full_name: "Username", email: "youremail@gmail.com" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active component based on URL path
    const path = location.pathname;
    if (path.includes("/orders")) {
      setActiveComponent("orderhistory");
    } else if (path.includes("/myaccount")) {
      setActiveComponent("myaccount");
    } else if (path.includes("/wishlist")) {
      setActiveComponent("wishlist");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Fetch user profile details on component mount
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://back-server-1.onrender.com/profile/', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails({
            full_name: data.full_name,
            email: data.email
          });
        } else {
          const data = await response.json();
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Failed to fetch user details: ' + error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://back-server-1.onrender.com/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        alert('Logged out successfully');
        navigate('/');
        window.location.reload();
      } else {
        const data = await response.json();
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <div className="main-account-container">
      <NavBar />
      <div className="container">
        {/* Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Sidebar content */}
          <div className="avator-container">
            <div className="avatar">
              <img src="user.bmp" alt="User" className="avatar-image" />
              <div className="avatar-fallback">User</div>
            </div>
            <div className={isMobileMenuOpen ? 'hidden' : ''}>
              <h2 className="component-title-sidebar">{userDetails.full_name}</h2>
              <p className="component-subtitle-sidebar">{userDetails.email}</p>
            </div>
          </div>
          {/* Navigation links */}
          <div className="head-sidebar">My panel</div>
          <nav className="nav-link">
            <a onClick={() => handleSidebarClick("orderhistory")} className={`custom-link ${activeComponent === "orderhistory" ? "active" : ""}`}>
              <PackageIcon className="icon" />
              <span className="label">Orders</span>
            </a>
            <a onClick={() => handleSidebarClick("wishlist")} className={`custom-link ${activeComponent === "wishlist" ? "active" : ""}`}>
              <HeartIcon className="icon" />
              <span className="label">Wishlist</span>
            </a>
            <a onClick={() => handleSidebarClick("myaccount")} className={`custom-link ${activeComponent === "myaccount" ? "active" : ""}`}>
              <UserIcon className="icon" />
              <span className="label">Account</span>
            </a>
            <a onClick={handleLogout} className="custom-link">
              <LogOutIcon className="icon" />
              <span className="label">Logout</span>
            </a>
          </nav>
        </div>

        {/* Main content container */}
        <div className="component-container">
          <div className="component-inner-container">
            <div className="component-body">
              {activeComponent === "orderhistory" && <OrderHistory />}
              {activeComponent === "myaccount" && <MyAccount />}
              {activeComponent === "wishlist" && <SavedItems />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="13" rx="2" ry="2" />
      <line x1="7" y1="2" x2="17" y2="7" />
      <line x1="7" y1="14" x2="17" y2="14" />
      <line x1="3" y1="9" x2="7" y2="9" />
      <line x1="3" y1="15" x2="7" y2="15" />
    </svg>
  );
}

function LogOutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 3h-13a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-14a2 2 0 0 0-2-2z" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="12" y1="16" x2="16" y2="12" />
      <line x1="12" y1="8" x2="16" y2="12" />
    </svg>
  );
}
