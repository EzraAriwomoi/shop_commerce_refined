// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import "../css/checkout/checkout.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import axios from 'axios';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
    const [shippingAddress, setShippingAddress] = useState("");
    const navigate = useNavigate();
    const [temporaryAddress, setTemporaryAddress] = useState(shippingAddress);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchCartItems();
        fetchUserProfile();
    }, []);

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://back-server-1.onrender.com/cart/", {
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

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://back-server-1.onrender.com/profile/", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setShippingAddress(response.data.location || "");
                setMpesaPhoneNumber(response.data.mpesaNumber || "");
            } else {
                throw new Error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const toggleEditMode = () => {
        setEditMode(prevEditMode => {
            console.log("Toggling edit mode. Previous:", prevEditMode);
            return !prevEditMode;
        });
    };

    useEffect(() => {
        setTemporaryAddress(shippingAddress);
    }, [shippingAddress]);


    // Save profile changes
    const handleInputChange = (e) => {
        setTemporaryAddress(e.target.value);
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        axios.put('https://back-server-1.onrender.com/update-location', { location: temporaryAddress }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                alert('Shipping address updated successfully!');
                setShippingAddress(temporaryAddress); // Update the actual state after saving
                setEditMode(false); // Exit edit mode after saving
            })
            .catch(error => {
                console.error('Error updating shipping address:', error);
                alert('Failed to update shipping address.');
            });
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

    const clearCart = () => {
        setCartItems([]);
    };

    const handlePlaceOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const orderData = {
                total_price: calculateTotal(),
                payment_method: selectedPaymentMethod,
                mpesa_phone_number: selectedPaymentMethod === "mpesa" ? mpesaPhoneNumber : null,
                shipping_address: shippingAddress,
                status: 'Pending',
                created_at: new Date().toISOString(),
            };

            const response = await axios.post("https://back-server-1.onrender.com/orders/", orderData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const orderId = response.data.order_id;

            if (selectedPaymentMethod === "mpesa") {
                const mpesaResponse = await axios.post("https://back-server-1.onrender.com/mpesa/online/lipa", {
                    order_id: orderId,
                    phone_number: mpesaPhoneNumber,
                    amount: calculateTotal(),
                }, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (mpesaResponse.status === 200) {
                    alert('Payment initiated successfully with M-PESA!');
                    clearCart();
                    alert('Order placed successfully!');
                    navigate('/orders');
                } else {
                    alert('Failed to initiate M-PESA payment');
                }
            } else {
                const orderItems = cartItems.map(item => ({
                    order_id: orderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                }));

                await axios.post("https://back-server-1.onrender.com/orders/items", orderItems, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // clearCart();
                // navigate('/orders');
                // alert('Order placed successfully!');
            }
        } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
            alert('Failed to place order');
        }
    };

    const locations = [
        "A.S.K. Showground/Wanye",
        "Adams Arcade / Dagoretti Corner",
        "Bahati / Marish / Viwandani / Jeri",
        "Bomas/CUEA/Galleria",
        "Buruburu / Hamza / Harambee",
        "CBD - GPO/City Market/Nation Centre",
        "CBD - KICC/Parliament/Kencom",
        "CBD - Luthuli/Afya Centre/ R. Ngala",
        "CBD - UON/Globe/Koja/River Road",
        "City Stadium/Makongeni/Mbotela",
        "Embakasi East-Pipeline/Transami/Airport North Rd",
        "Embakasi North - Dandora / Kariobangi North",
        "Embakasi South - Bunyala Road / South B",
        "Embakasi South - Mombasa Road/Sameer Park/General Motors/ICD",
        "Embakasi South-Landimawe/KwaReuben/Kware/Pipeline",
        "Garden Estate/Thome/Marurui",
        "Gigiri/Village market/UN",
        "Githurai/Kahawa Sukari",
        "Hurlingham/DOD/Yaya center",
        "Huruma / Kiamaiko / Mbatini / Ngei",
        "Imara Daima/AA/Maziwa/Kwa Njenga",
        "Kahawa Wendani/ Kenyatta University",
        "Kahawa west/Githurai 44",
        "Kamukunji - Airbase/Mlango Kubwa",
        "Kamukunji - Eastleigh/California/Shauri Moyo",
        "Kamulu",
        "Karen",
        "Kariobangi South/Dandora/Airbase",
        "Kawangware/Stage 56",
        "Kilimani/State House/Denis Pritt",
        "Kinoo/Zambezi/Ngecha",
        "Kiserian/Corner Baridi/Ongata Rongai",
        "Korogocho / Baraka / Gitathuru / Grogan",
        "Langata/Hardy/Mbagathi",
        "Lavington/Mziima/James Gichuru",
        "Muthaiga/Parklands",
        "Ngara/Pangani",
        "Ngong/Kibiku",
        "Nyayo Highrise/Nairobi West",
        "Roy Sambu/Kasarani",
        "Ruai",
        "Ruiru",
        "Runda/Estate/Muthaiga",
        "Rwaka/Two Rivers",
        "South C",
        "Thindigua/Kasarini",
        "Umoja/Infill",
        "Utawala",
        "Valley Road / Community / Kenyatta Hospital",
        "Waiyaki Way/Kangemi",
        "Westlands",
        "Ziwani/Zimmerman/Githurai 45"
    ];


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
                                                    <select
                                                        className={`row-input-shipping select-hidden ${editMode ? 'pointer-cursor' : 'default-cursor'}`}
                                                        title="shipping address"
                                                        value={temporaryAddress}
                                                        onChange={handleInputChange}
                                                        disabled={!editMode}
                                                    >
                                                        <option value=""/>
                                                        {locations.map(location => (
                                                            <option key={location} value={location}>
                                                                {location}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        className="change-button"
                                                        onClick={() => {
                                                            if (editMode) {
                                                                handleSave();
                                                            }
                                                            toggleEditMode();
                                                        }}
                                                    >
                                                        {editMode ? "Save" : "Change"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="header-info-h2">Payment Method</h2>
                                    <div className="payment-container">
                                        <div className="payment-header">
                                            <p className="payment-description">All transactions are secure and encrypted. Select a payment method.</p>
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
                                                                        <span className="payment-option-title">Credit card
                                                                        <span className="unavailable-text">currently not available</span>
                                                                        </span>
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
                                                                            value={mpesaPhoneNumber}
                                                                            name="basic"
                                                                            className="payment-input"
                                                                            checked={selectedPaymentMethod === "mpesa"}
                                                                            onChange={(e) => handlePaymentMethodChange("mpesa", e.target.value)}
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
                                                                        <p className="mpesa-description">You will be prompted with a pop-up window to enter your M-PESA pin once you place the order.</p>
                                                                    </div>
                                                                    <div className="payment-field">
                                                                        <input
                                                                            type="text"
                                                                            value={mpesaPhoneNumber}
                                                                            onChange={(e) => {
                                                                                setMpesaPhoneNumber(e.target.value);
                                                                                // console.log("M-PESA phone number updated:", e.target.value); // Debugging statement
                                                                            }}
                                                                            placeholder="Enter your m-pesa number"
                                                                            className="field-input">
                                                                            {/* disabled={selectedPaymentMethod !== "mpesa"} */}
                                                                        </input>
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
                                <button type="button" className="pay-now-button" onClick={handlePlaceOrder}>Place order</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
