// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
// import CustomerAuth from "./pages/customerauth";
// import MerchantAuth from "./pages/merchantauth";
import HomePage from "./pages/homepage";
// import NavBar from "./components/layout/NavBar";
import ProductDetails from "./pages/ProductDetails";
import ShoppingcartPage from "./pages/shoppingcart";
import ProductListPage from "./pages/productlisting";
import FAQPage from "./pages/FAQPage";
import ResetPasswordPage from "./components/customerauthcomponents/ResetPasswordComponent";
import MainAccount from "./components/accountInfo/mainaccount";
import ContactUs from "./pages/ContactUs";
import Checkout from "./pages/checkout";
import AboutUs from "./pages/aboutus";
import CustomerSignInComponent from "./components/customerauthcomponents/CustomerSignInComponent";

function App() {
  const [isSignInVisible, setIsSignInVisible] = useState(false);

  const toggleSignIn = () => {
    setIsSignInVisible(!isSignInVisible);
  };

  return (
    <Router>
      <main className={isSignInVisible ? "app dimmed" : "app"}>
        <Routes>
          <Route path="/" exact element={<HomePage onSignInClick={toggleSignIn} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/shoppingcart" element={<ShoppingcartPage onSignInClick={toggleSignIn} />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/myaccount" element={<MainAccount />} />
          <Route path="/orders" element={<MainAccount />} />
          <Route path="/wishlist" element={<MainAccount />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        {isSignInVisible && <CustomerSignInComponent onClose={toggleSignIn} />}
      </main>
    </Router>
  );
}

export default App;
