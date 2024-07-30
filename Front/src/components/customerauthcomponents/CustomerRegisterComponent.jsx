// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "../../css/customerauthcss/customersignin.css";

// eslint-disable-next-line react/prop-types
const CustomerRegisterComponent = ({ onClose, onChangeView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors
  
    if (password !== confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`,
          email,
          password,
          confirm_password
        }),
      });
  
      const data = await response.json();
  
      // Check if response is not ok and throw an error if it isn't
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
  
      // Display success message
      alert(data.message); // Replace with your preferred UI notification
  
      // Redirect to sign-in view after successful registration
      onChangeView('sign-in');
  
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCloseClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="sign-in-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseClick()}>
      <div className={`customer-sign-in-component ${isVisible ? 'drop-down' : ''}`}>
        {loading && (
          <div className="progress-bar">
            <div className="loader">
              <div className="loaderBar"></div>
            </div>
          </div>
        )}
        <div className="csc-heading">
          <h1>Register</h1>
          <button className="close-btn" onClick={handleCloseClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleRegister} className="csc-form flex-col">
          <div className="csc-input-div">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="csc-input-div">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="csc-input-div">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="csc-input-div">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="csc-input-div">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="csc-buttons flex">
            <button type="submit">Register</button>
          </div>
          <span className="back-to-sign-in" onClick={() => onChangeView('sign-in')}>
            Already have an account? Sign In
          </span>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegisterComponent;
