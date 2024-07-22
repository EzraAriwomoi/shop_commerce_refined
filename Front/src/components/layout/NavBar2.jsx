import { useState } from "react";
import "../../css/layoutcss/layout.css";

//icons
import { FaUserAlt } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState([
    {
      productName: "Ring",
      prodcutId: 1,
      timeStamp: "12:00 a.m",
      imageSrc: "public/23.jpg",
    },
    {
      productName: "Ring",
      prodcutId: 1,
      timeStamp: "12:00 a.m",
      imageSrc: "public/25.jpg",
    },
    {
      productName: "Ring",
      prodcutId: 1,
      timeStamp: "12:00 a.m",
      imageSrc: "public/26.jpg",
    },
  ]);

  return (
    <div className="notification-menu">
      <ul className="notf-cont">
        {notifications.map((a) => {
          return (
            <a href="#" className="notf-box">
              <div className="nb-image">
                <img src={a.imageSrc} />
              </div>
              <div className="nb-details">
                <h3>{a.productName}</h3>
                <p>{a.timeStamp}</p>
              </div>
            </a>
          );
        })}
      </ul>
    </div>
  );
};

const NavBar = () => {
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleNotfication, setToggleNotification] = useState(false);

  return (
    <nav className="navbar">
      <span>KLETOS</span>

      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/products">Product</a>
        </li>
        <li
          onClick={(e) => {
            toggleProfile && setToggleProfile(false);
            setToggleNotification(!toggleNotfication);
          }}
        >
          {toggleNotfication ? "close" : <FaBell />}
        </li>
        {toggleNotfication && <NotificationMenu />}

        <li
          className="my-profile"
          onClick={(e) => {
            toggleNotfication && setToggleNotification(false);
            setToggleProfile(!toggleProfile);
          }}
        >
          {toggleProfile ? "close" : <FaUserAlt />}
        </li>
        <li>
          <a href="#">
            <FaShoppingCart />
          </a>
        </li>

        {toggleProfile && (
          <div className="my-profile-menu">
            <ul className="mpm-drop-down">
              <li>My Account</li>
              <li>Orders</li>
              <li>Wish List</li>
            </ul>
            <span>Log Out</span>
          </div>
        )}

        {false && (
          <button>
            <a href="/auth">Sign In</a>
          </button>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
