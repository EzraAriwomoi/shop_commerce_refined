import { useState } from "react";
import "../../css/merchantauthcss/merchantlogin.css";
import MerchantSignUp from "./MerchantSignUp";

const MerchantLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  const validateLogin = () => {
    const errors = {};
    if (!loginUsername) {
      errors.username = "Username is required";
    }
    if (!loginEmail) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "Email address is invalid";
    }
    if (!loginPassword) {
      errors.password = "Password is required";
    } else if (loginPassword.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
    } else {
      alert("Login form submitted successfully!");
    }
  };

  return (
    <div className="auth-container">
      {!isSignUp ? (
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className={loginErrors.username ? "error" : ""}
              />
              {loginErrors.username && (
                <p className="error-text">{loginErrors.username}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={loginErrors.email ? "error" : ""}
              />
              {loginErrors.email && (
                <p className="error-text">{loginErrors.email}</p>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={loginErrors.password ? "error" : ""}
              />
              {loginErrors.password && (
                <p className="error-text">{loginErrors.password}</p>
              )}
            </div>
            <button type="submit" className="btn">
              Login
            </button>
          </form>
          <div className="switch-auth">
            <p>
              Don&apos;t have an account?{" "}
              <span onClick={() => setIsSignUp(true)}>Sign Up</span>
            </p>
          </div>
        </div>
      ) : (
        <MerchantSignUp setIsSignUp={setIsSignUp} />
      )}
    </div>
  );
};

export default MerchantLogin;
