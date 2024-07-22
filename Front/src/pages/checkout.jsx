// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "../css/checkout/checkout.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import axios from 'axios';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/cart/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status !== 200) {
                throw new Error("Failed to fetch cart items");
            }
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const calculateSubtotal = () => {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += parseFloat(item.product_price) * item.quantity;
        });
        return subtotal.toFixed(2);
    };

    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const discount = subtotal * (6.12 / 100);
        const shipping = 500.00;
        return (subtotal + shipping - discount).toFixed(2);
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    return (
        <>
            <Helmet>
                <title>Checkout</title>
                <meta name="description" content="" />
            </Helmet>
            <NavBar />
            <div className="containerA">
                <div className="head-order">
                    <p className="text-order-style">My Orders</p>
                </div>
                <div className="divider"></div>
                <div className="main-checkout-container">
                    <div className="checkout-container-divide">
                        <div className="checkout-container">
                            <div className="payment-info">
                                <div className="div-two-details">
                                    <div className="shipping-container">
                                        <h2 className="header-info-h2">Shipping information</h2>
                                        <div className="shipping-header">
                                            <p className="shipping-description">Confirm your shipping location or update it.</p>
                                        </div>
                                        <div className="shipping-field">
                                            <div className="field-container">
                                                <div className="input-wrapper">
                                                    <input className="row-input-shipping" title="shipping address" />
                                                    <button className="change-button">Change</button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="header-info-h2">Payment Method</h2>
                                    <div className="payment-container">
                                        <div className="payment-header">
                                            <p className="payment-description">All transactions are secure and encrypted. Select a payment menthod.</p>
                                        </div>
                                        <div className="payment-methods">
                                            <div className="payment-method">
                                                <div id="basic">
                                                    <legend className="payment-legend">Choose a payment method</legend>
                                                    <div className="payment-options">
                                                        <div className="payment-option">
                                                            <label htmlFor="basic-creditCards" className={`payment-label ${selectedPaymentMethod === "creditCard" ? "checked" : ""}`}>
                                                                <div className="r-box">
                                                                    <div className="payment-radio">
                                                                        <input
                                                                            type="radio"
                                                                            id="basic-creditCards"
                                                                            name="basic"
                                                                            className="payment-input"
                                                                            checked={selectedPaymentMethod === "creditCard"}
                                                                            onChange={() => handlePaymentMethodChange("creditCard")}
                                                                        />
                                                                    </div>
                                                                    <div className="payment-option-details">
                                                                        <span className="payment-option-title">Credit card</span>
                                                                        <div className="payment-icons">
                                                                            <img alt="VISA" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" width="38" height="24" className="payment-icon" />
                                                                            <img alt="MASTERCARD" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/ae9ceec48b1dc489596c.svg" width="38" height="24" className="payment-icon" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <div className={`collapsible-content ${selectedPaymentMethod === "creditCard" ? "active" : ""}`}>
                                                                <div className="payment-details">
                                                                    <div className="payment-field">
                                                                        <input type="" placeholder="Card number" className="field-input"></input>
                                                                    </div>
                                                                    <div className="row-pay">
                                                                        <div className="payment-field">
                                                                            <div className="field-container">
                                                                                <input className="row-input-frame" placeholder="Expiration date (MM / YY)" title="Expiration date (MM / YY)"></input>
                                                                            </div>
                                                                        </div>
                                                                        <div className="payment-field">
                                                                            <div className="field-container">
                                                                                <input className="row-input-frame" placeholder="Security code" title="Security code"></input>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="payment-field">
                                                                        <div className="field-container">
                                                                            <input className="field-input" placeholder="Name on card" title="Name on card"></input>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mpesa-component">
                                                            <label htmlFor="basic-mpesa" className={`payment-label ${selectedPaymentMethod === "mpesa" ? "checked" : ""}`}>
                                                                <div className="r-box">
                                                                    <div className="payment-radio">
                                                                        <input
                                                                            type="radio"
                                                                            id="basic-mpesa"
                                                                            name="basic"
                                                                            className="payment-input"
                                                                            checked={selectedPaymentMethod === "mpesa"}
                                                                            onChange={() => handlePaymentMethodChange("mpesa")}
                                                                        />
                                                                    </div>
                                                                    <div className="payment-option-details">
                                                                        <span className="payment-option-title">M-PESA</span>
                                                                        <div className="payment-icons">
                                                                            <img alt="M-PESA" src="mpesa.png" width="54" height="48" className="mpesa-icon" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <div className={`collapsible-content ${selectedPaymentMethod === "mpesa" ? "active" : ""}`}>
                                                                <div className="payment-details">
                                                                    <div className="message-header">
                                                                        <p className="mpesa-description">You will be prompt with a pop-up window to enter your M-PESA pin once you place the order.</p>
                                                                    </div>
                                                                    <div className="payment-field">
                                                                        <input type="phone" placeholder="Enter your m-pesa number" className="field-input"></input>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="cash-component">
                                                            <label htmlFor="basic-cash" className={`payment-label ${selectedPaymentMethod === "cash" ? "checked" : ""}`}>
                                                                <div className="r-box">
                                                                    <div className="payment-radio">
                                                                        <input
                                                                            type="radio"
                                                                            id="basic-cash"
                                                                            name="basic"
                                                                            className="payment-input"
                                                                            checked={selectedPaymentMethod === "cash"}
                                                                            onChange={() => handlePaymentMethodChange("cash")}
                                                                        />
                                                                    </div>
                                                                    <div className="payment-option-details">
                                                                        <span className="payment-option-title">Cash on delivery</span>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <div className={`collapsible-content ${selectedPaymentMethod === "cash" ? "active" : ""}`}>
                                                                <div className="payment-details">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Add other payment methods here if needed */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-summary">
                                <header className="header-sum-order">
                                    <a className="edit-summary" href="/shoppingcart">
                                        <svg className="svg-back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                                        </svg>
                                    </a>
                                    <h2 className="header-info-h2">Order Summary</h2>
                                </header>
                                {cartItems.map((product) => (
                                    <div key={product.product_id} className="product-item">
                                        <img src={product.image_url} alt={`Image of ${product.product_name}`} className="product-image" />
                                        <div className="overal-products">
                                            <span className="productname">{product.product_name}</span>
                                            <span className="product-qty">{` x${product.quantity}`}</span>
                                            <span className="product-price">{`Kes. ${product.product_price}`}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="cost-summary">
                                    <h4>Cost Summary</h4>
                                    <div className="cost-item">
                                        <span>Subtotal</span>
                                        <span>{`Kes. ${calculateSubtotal()}`}</span>
                                    </div>
                                    <div className="cost-item">
                                        <span>Shipping</span>
                                        <span>Enter shipping address</span>
                                    </div>
                                    <div className="cost-item">
                                        <span>TOTAL</span>
                                        <span>{`Kes. ${calculateTotal()}`}</span>
                                    </div>
                                </div>
                                <div className="divide-bottom"></div>
                                <button type="submit" className="pay-now-button">Place order</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
