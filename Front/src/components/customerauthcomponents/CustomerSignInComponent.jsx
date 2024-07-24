import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/customerauthcss/customersignin.css";

const CustomerSignInComponent = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('sign-in'); // State to toggle between sign-in, reset password, and register
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Reset password request successful:', data);
        setView('sign-in'); // Return to sign-in view after successful request
        setEmail('');
        setError(''); // Clear any previous error messages
      } else {
        const errorMessage = data.error || 'Password reset failed';
        setError(errorMessage);
        console.error('Password reset failed:', errorMessage);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error during password reset:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
          password
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert(data.message); // Replace with your preferred UI notification
      setView('sign-in'); // Return to sign-in view after successful registration

    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed');
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
          <h1>{view === 'sign-in' ? 'Sign In' : view === 'reset-password' ? 'Reset Password' : 'Register'}</h1>
          <button className="close-btn" onClick={handleCloseClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        {view === 'sign-in' ? (
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
            <a href="#" onClick={() => setView('reset-password')} className="forgot-password">Forgot Password?</a>
            {error && <p className="error-message">{error}</p>}
            <div className="csc-buttons flex">
              <button type="submit">Sign In</button>
            </div>
            <span className="register-section">
              Don’t have an account?{" "}
              <span className="register-action" onClick={() => setView('register')}>
                Register
              </span>
            </span>
          </form>
        ) : view === 'reset-password' ? (
          <form onSubmit={handleResetPassword} className="csc-form flex-col">
            <p className="reset-password-message">We will send you an email to reset your password.</p>
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
              <button type="submit">Send Reset Link</button>
            </div>
            <span className="back-to-sign-in" onClick={() => setView('sign-in')}>
              Back to Sign In
            </span>
          </form>
        ) : (
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="csc-buttons flex">
              <button type="submit">Register</button>
            </div>
            <span className="back-to-sign-in" onClick={() => setView('sign-in')}>
              Already have an account? Sign In
            </span>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerSignInComponent;
