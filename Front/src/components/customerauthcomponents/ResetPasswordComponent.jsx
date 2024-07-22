// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "../../css/customerauthcss/resetpassword.css";

const ResetPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    return () => {
      clearInterval(timerId);
    };
  }, [timerId]);

  const handleResetPassword = () => {
    if (email.trim() !== "") {
      fetch("/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setShowConfirmation(true);
            startCountdown();
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const startCountdown = () => {
    setCountdown(20);
    const id = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(id);
        }
        return prevCount - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const handleResendEmail = () => {
    if (!timerId) {
      startCountdown();
    }
  };

  return (
    <div className="reset-password-component">
      {!showConfirmation ? (
        <div className="reset-form">
          <h2>Reset Password</h2>
          <div className="reset-inputs">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="reset-button" onClick={handleResetPassword}>
            Reset
          </button>
        </div>
      ) : (
        <div className="confirmation-message">
          <p>A password reset email has been sent to:</p>
          <p>
            <strong>{email}</strong>
          </p>
          <p>Check your email and follow the instructions to reset your password.</p>
          <div className="timer">
            <p>
              Resend email in <strong>{countdown} seconds</strong>
            </p>
            <button
              className="resend-button"
              onClick={handleResendEmail}
              disabled={countdown !== 0}
            >
              Resend Email
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordComponent;
