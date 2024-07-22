// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "../../css/myaccount/myaccount.css";
import MyAccount from "./subcomponents/myaccount";
import OrderHistory from "./subcomponents/orderhistory";
import SavedItems from "./subcomponents/wishlist";
import NavBar from "../../components/layout/NavBar";
// import Footer from "../../components/layout/Footer";

export default function MainAccount() {
  const [isMobileMenuOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("myaccount");

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="main-account-container">
      <NavBar />
      <div className="container">
        {/* Sidebar */}
        <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Sidebar content */}
          <div className="flex items-center gap-4 mb-8">
            <div className="avatar">
              <img src="/placeholder-user.jpg" alt="User Avatar" className="avatar-image" />
              <div className="avatar-fallback">User</div>
            </div>
            <div className={isMobileMenuOpen ? 'hidden' : ''}>
              <h2 className="component-title-sidebar">User</h2>
              <p className="component-subtitle-sidebar">email@example.com</p>
            </div>
          </div>
          {/* Navigation links */}
          <div className="head-sidebar">My panel</div>
          <nav className="nav-link">
            <a onClick={() => handleSidebarClick("orderhistory")} className="custom-link">
              <PackageIcon className="icon" />
              <span className="label">Orders</span>
            </a>
            <a onClick={() => handleSidebarClick("wishlist")} className="custom-link">
              <HeartIcon className="icon" />
              <span className="label">Wishlist</span>
            </a>
            <a onClick={() => handleSidebarClick("myaccount")} className="custom-link">
              <UserIcon className="icon" />
              <span className="label">Account</span>
            </a>
            <a className="custom-link">
              <LogOutIcon className="icon" />
              <span className="label">Logout</span>
            </a>
          </nav>
        </div>

        {/* Main content container */}
        <div className="component-container">
          <div className="component-inner-container">
            <div className="component-header">
              <div className="component-header-content">
                <header className="header-sum-info">
                  <a className="edit-summary-information" href="">
                    <svg className="svg-back-info" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                  </a>
                  <h2 className="header-infopage-h2">Account Information</h2>
                </header>
              </div>
            </div>
            <div className="component-body">
              {activeComponent === "orderhistory" && <OrderHistory />}
              {activeComponent === "myaccount" && <MyAccount />}
              {activeComponent === "wishlist" && <SavedItems />}
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
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
      <line x1="12" y1="8" x2="12" y2="16" />
    </svg>
  );
}

// function MenuIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       stroke="#d9d9d9"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M3 12h18M3 6h18M3 18h18" />
//     </svg>
//   );
// }