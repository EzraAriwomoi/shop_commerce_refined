// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "../css/contactuscss/contactus.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    try {
      const response = await fetch('https://back-server-1.onrender.com/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Handle success (e.g., show a success message)
        alert('Support ticket submitted successfully');
      } else {
        // Handle error response from server
        const data = await response.json();
        alert('Failed to submit support ticket:', data.error);
      }
    } catch (error) {
      alert('Error submitting support ticket:', error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="outer-container">
        <div className="containerr">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="head-contactus">CONTACT US</h2>
                <p className="text-muted-foreground">
                  Have a question or want to work together? Fill out the form
                  below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="lblname" htmlFor="name">Name</label>
                    <input
                      id="name"
                      className="input-field"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="lblname" htmlFor="email">Email</label>
                    <input
                      id="email"
                      className="input-field"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="lblname" htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      className="input-field"
                      type="text"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="lblname" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    className="textarea-field"
                    rows={5}
                    placeholder="Enter your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button className="send-button" type="submit">
                  Send
                </button>
              </form>
            </div>
            <div className="img-container">
              <img
                src="https://img.freepik.com/premium-photo/black-woman-secretary-business-telephone-call-working-communication-calling-clients-african-lady-girl-receptionist-speaking-with-office-management-person-corporate-company-call_590464-83800.jpg"
                alt="Company Location"
                className="rounded-lg w-full h-auto image-fit"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
