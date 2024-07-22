import { useState } from "react";
import PropTypes from "prop-types";
import "../../css/merchantauthcss/merchantsignup.css";

const MerchantSignUp = ({ setIsSignUp }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      label: "Basic Information",
      fields: [
        "Merchant Name",
        "Contact Person",
        "Email Address",
        "Phone Number",
        "Physical Address",
      ],
    },
    {
      label: "Business Details",
      fields: [
        "Business Type",
        "Business Registration Number",
        "Tax Identification Number (TIN)",
        "Years in Operation",
        "Website URL",
      ],
    },
    {
      label: "Financial Information",
      fields: [
        "Bank Account Details",
        "Payment Methods Accepted",
        "Transaction Fees",
      ],
    },
    {
      label: "Product Information",
      fields: ["Product Categories", "Product Listings", "SKU Numbers"],
    },
  ];

  const handleNext = () => {
    if (currentStep === steps.length) {
      alert("Form submitted!");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="container">
      <div className="progress-container">
        <div
          className="progress"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-wrap ${index + 1 <= currentStep ? "active" : ""}`}
          >
            <div className="circle">{index + 1}</div>
            <p className="text">{step.label}</p>
          </div>
        ))}
      </div>
      <form>
        <div className="form-grid">
          {steps[currentStep - 1].fields.map((field, index) => (
            <div key={index} className="form-group">
              <label>{field}</label>
              <input type="text" placeholder={field} />
            </div>
          ))}
        </div>
      </form>
      <div className="button-container">
        <button
          className="btn"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          &larr; Back
        </button>
        <button className="btn" onClick={handleNext}>
          {currentStep === steps.length ? "Submit" : "Next"} &rarr;
        </button>
      </div>
      <div className="switch-auth">
        <p>
          Already have an account?{" "}
          <span onClick={() => setIsSignUp(false)}>Login</span>
        </p>
      </div>
    </div>
  );
};

MerchantSignUp.propTypes = {
  setIsSignUp: PropTypes.func.isRequired,
};

export default MerchantSignUp;
