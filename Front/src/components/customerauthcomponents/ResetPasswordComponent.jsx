// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "../../css/customerauthcss/customersignin.css";

// eslint-disable-next-line react/prop-types
const ResetPasswordComponent = ({ onClose, onChangeView }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://back-server-1.onrender.com/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Request password reset failed');
      }

      alert(data.message);
      onChangeView('password-reset-form', { token: data.token });

    } catch (error) {
      console.error('Error requesting password reset:', error);
      setError('Request password reset failed');
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
        <div className="csc-heading">
          <h1>Reset Password</h1>
          <button className="close-btn" onClick={handleCloseClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleResetPassword} className="csc-form flex-col">
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
          {error && <p className="error-message">{error}</p>}
          <div className="csc-buttons flex">
            <button type="submit">Reset Password</button>
          </div>
          <span className="back-to-sign-in" onClick={() => onChangeView('sign-in')}>
            Back to Sign In
          </span>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
