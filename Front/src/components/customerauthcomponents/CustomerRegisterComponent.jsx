import React, { useState } from "react";
import "../../css/customerauthcss/customerregister.css";

const CustomerRegisterComponent = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert(data.message); // Replace with your preferred UI notification
      // Optionally redirect or perform other actions after successful registration

    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="customer-register-component flex-col">
      <div className="crc-heading flex">
        <h1>REGISTER</h1>
      </div>
      <form className="crc-inputs flex-col" onSubmit={handleSubmit}>
        <div className="crc-input-div flex-col-left">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>
        <div className="crc-input-div flex-col-left">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="crc-input-div flex-col-left">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="crc-input-div flex-col-left">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />
        </div>
        <div className="crc-input-div flex-col-left">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </div>
        <div className="crc-buttons flex">
          <button type="submit">Register</button>
        </div>
      </form>
      <span className="crc-sign-section">
        I have an account <span className="crc-sign-in-action" onClick={onToggle}>Sign In</span>
      </span>
    </div>
  );
};

export default CustomerRegisterComponent;
