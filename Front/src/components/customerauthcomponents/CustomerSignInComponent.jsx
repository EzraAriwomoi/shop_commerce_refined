// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/customerauthcss/customersignin.css";

// eslint-disable-next-line react/prop-types
const CustomerSignInComponent = ({ onClose, onChangeView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Sign-in successful:', data);
        localStorage.setItem('token', data.token);
        navigate('/');
        window.location.reload();
      } else {
        const errorMessage = data.error || 'Sign-in failed';
        setError(errorMessage);
        console.error('Sign-in failed:', errorMessage);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error during sign-in:', error);
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
          <h1>Sign In</h1>
          <button className="close-btn" onClick={handleCloseClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSignIn} className="csc-form flex-col">
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
          <span onClick={() => onChangeView('reset-password')} className="forgot-password">Forgot Password?</span>
          {error && <p className="error-message">{error}</p>}
          <div className="csc-buttons flex">
            <button type="submit">Sign In</button>
          </div>
          <span className="register-section">
            Don&apos;t have an account?{" "}
            <span className="register-action" onClick={() => onChangeView('register')}>
              Register
            </span>
          </span>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignInComponent;
