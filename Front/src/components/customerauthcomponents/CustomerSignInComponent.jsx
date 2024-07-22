import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/customerauthcss/customersignin.css";

const CustomerSignInComponent = ({ onToggle, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        // setIsLoggedIn(true); 
        navigate('/');
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

  return (
    <div className="customer-sign-in-component flex-col">
      <div className="csc-heading flex">
        <h1>SIGN IN</h1>
      </div>
      <form onSubmit={handleSignIn} className="csc-inputs flex-col">
        <div className="csc-input-div flex-col-left">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="csc-input-div flex-col-left">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <a href="/resetpassword" className="forgot-password flex">Forgot Password?</a>
        {error && <p className="error-message">{error}</p>}
        <div className="csc-buttons flex">
          <button type="submit">Sign In</button>
        </div>
      </form>
      <span className="register-section">
        Don&apos;t have an account?{" "}
        <span className="register-action" onClick={onToggle}>
          Register
        </span>
      </span>
    </div>
  );
};

export default CustomerSignInComponent;
