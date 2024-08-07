/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "../css/shoppingcartcss/shoppingcart.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import axios from 'axios';

const CloseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    width="16"
    height="16"
    className="close-icon"
  >
    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
  </svg>
);

function ShoppingCartItems({
  product_id,
  image_url,
  product_name,
  product_price,
  quantity: initialQuantity,
  fetchCartItems,
  ...props
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [subtotal, setSubtotal] = useState(parseFloat(product_price * initialQuantity).toFixed(2));

  const increaseQuantity = async () => {
    const newQuantity = quantity + 1;
    await updateQuantity(newQuantity);
    setQuantity(newQuantity);
  };

  const decreaseQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      await updateQuantity(newQuantity);
      setQuantity(newQuantity);
    }
  };

  const updateQuantity = async (newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://back-server-1.onrender.com/cart/update/${product_id}`, {
        product_id: product_id,
        quantity: newQuantity,
      }, {
        method:'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchCartItems(); // Refresh cart items after update
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  useEffect(() => {
    const newSubtotal = (parseFloat(product_price) * quantity).toFixed(2);
    setSubtotal(newSubtotal);
  }, [quantity, product_price]);

  const handleRemoveItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`https://back-server-1.onrender.com/cart/remove/${product_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log("Item removed successfully");
        fetchCartItems(); // Fetch updated cart items after deletion
      } else {
        console.error("Failed to remove item:", response.data.error);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };  

  return (
    <div {...props} className={`${props.className} flex-container`}>
      <div className="flex-full">
        <img src={image_url} alt="image" className="image-cover" />
        <div className="flex-column-start">
          <div className="flex-start-between">
            <h5 className="h5txt">{product_name}</h5>
            <button
              className="close-button"
              aria-label="Close"
              onClick={handleRemoveItem}
            >
              {CloseIcon}
            </button>
          </div>
          <p className="kescountertext">Kes. {product_price}</p>
          <div className="bdy">
            <div className="divhead">
              <div className="quantity-controls">
                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-button" onClick={increaseQuantity}>+</button>
              </div>
            </div>
            <h5 className="kescountertext1">Kes. {subtotal}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShoppingcartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      fetchCartItems();
    }
  }, []);

  const proceedtocheckout = () => {
    window.location.href = "/checkout";
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://back-server-1.onrender.com/cart/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      console.log("Cart items fetched:", data);
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += parseFloat(item.product_price) * item.quantity;
    });
    return subtotal.toFixed(2);
  };

  // Function to calculate total
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const discount = subtotal * (6.12 / 100); // Example discount percentage
    const shipping = 500.00; // Example shipping cost
    return (subtotal + shipping - discount).toFixed(2);
  };

  return (
    <>
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <NavBar />
      <div className="containerA">
        <div className="fdiv">
          <p className="text-stylingn dot">My Cart</p>
          <p className="itms">{cartItems.length} items selected</p>
        </div>
        <div className="divider"></div>
        {cartItems.length === 0 ? (
            <div className="empty-cart-container">
              <img src="no-cart-item-image.png" alt="No items in cart" className="empty-cart-image" />
              <p className="empty-cart-text">No items in cart</p>
            </div>
          ) : (
        <div className="container2">
          <div className="container3">
            <div className="container4">
              {cartItems.map((item, index) => (
                <ShoppingCartItems
                  key={`cart-item-${index}`}
                  product_id={item.product_id}
                  image_url={item.image_url}
                  product_name={item.product_name}
                  product_price={item.product_price}
                  quantity={item.quantity}
                  fetchCartItems={fetchCartItems}
                />
              ))}
            </div>
          </div>
          <div className="container5">
            <div className="container6">
              <div className="container7">
                <h2>Order summary</h2>
                <div className="container8">
                  <div className="divider3"></div>
                  <div className="l1">
                    <p className="text-styling">Sub-total</p>
                    <p className="text-styling1">Kes. {calculateSubtotal()}</p>
                  </div>
                  <div className="l2">
                    <p className="text-styling">Shipping Fee</p>
                    <p className="text-styling1">Kes. 500.00</p>
                  </div>
                  <div className="l3">
                    <p className="text-styling">Discount</p>
                    <p className="text-styling1">Kes. {(calculateSubtotal() * 0.0612).toFixed(2)}</p>
                  </div>
                  <div className="divider3"></div>
                  <div className="l4">
                    <h5 className="text-stylingh">Total</h5>
                    <h5 className="text-stylingh1">Kes. {calculateTotal()}</h5>
                  </div>
                </div>
                <button className="payment" onClick={proceedtocheckout}>
                  <img src="images/img_arrowright.svg" alt="arrow_right" className="arrow-rght" />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
          )}
        {cartItems.length > 0 && (
        <>
        <div className="divider"></div>
        <div className="discount-code">
          <div className="">
            <div className="coupon">Have a coupon? Enter your code here</div>
            <div className="inpu-btn">
              <input className="" placeholder="Discount code"></input>
              <button className="applybtn">Apply</button>
            </div>
          </div>
        </div>
        </>
        )}
        <Footer />
      </div>
    </>
  );
}
