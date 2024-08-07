/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function MyAccount() {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    mpesaNumber: ''
  });
  const [editMode, setEditMode] = useState({
    personalDetails: false,
    accountPassword: false,
    shippingAddress: false,
    paymentInformation: false,
  });

  useEffect(() => {
    // Fetch user details from backend
    const token = localStorage.getItem("token");
    axios.get('https://back-server-1.onrender.com/profile/', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        const { full_name, email, phone, location, mpesaNumber } = response.data;
        const [firstName, lastName] = full_name.split(' ');
        setUserDetails({ firstName, lastName, email, phone, location, mpesaNumber });
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
          console.error('Unauthorized access - check your token');
        }
      });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [id]: value
    }));
  };

  const toggleEditMode = (section) => {
    setEditMode(prevEditMode => ({
      ...prevEditMode,
      [section]: !prevEditMode[section]
    }));
  };

  const handleSave = (section) => {
    const token = localStorage.getItem("token");

    switch (section) {
      case 'personalDetails':
        axios.put('https://back-server-1.onrender.com/update-personal-details', {
          first_name: userDetails.firstName,
          last_name: userDetails.lastName,
          email: userDetails.email,
          phone: userDetails.phone
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            alert('Personal details updated successfully!');
            toggleEditMode(section);
            window.location.reload();
          })
          .catch(error => console.error('Error updating personal details:', error));
        break;

      case 'accountPassword': {
        const { oldPassword, newPassword, confirmPassword } = userDetails;
        if (newPassword !== confirmPassword) {
          alert('New passwords do not match!');
          return;
        }

        axios.put('https://back-server-1.onrender.com/change-password', {
          old_password: oldPassword,
          new_password: newPassword
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            alert('Password changed successfully!');
            toggleEditMode(section);
          })
          .catch(error => console.error('Error changing password:', error));
        break;
      }

      case 'shippingAddress':
        axios.put('https://back-server-1.onrender.com/profile/update-location', { location: userDetails.location }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            alert('Shipping address updated successfully!');
            toggleEditMode(section);
          })
          .catch(error => console.error('Error updating shipping address:', error));
        break;

      case 'paymentInformation':
        axios.put('https://back-server-1.onrender.com/profile/update-payment', { mpesaNumber: userDetails.mpesaNumber }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            alert('Payment information updated successfully!');
            toggleEditMode(section);
          })
          .catch(error => console.error('Error updating payment information:', error));
        break;

      default:
        console.error('Unknown section:', section);
    }
  };


  const locations = [
    "A.S.K. Showground/Wanye",
    "Adams Arcade / Dagoretti Corner",
    "Bahati / Marish / Viwandani / Jeri",
    "Bomas/CUEA/Galleria",
    "Buruburu / Hamza / Harambee",
    "CBD - GPO/City Market/Nation Centre",
    "CBD - KICC/Parliament/Kencom",
    "CBD - Luthuli/Afya Centre/ R. Ngala",
    "CBD - UON/Globe/Koja/River Road",
    "City Stadium/Makongeni/Mbotela",
    "Embakasi East-Pipeline/Transami/Airport North Rd",
    "Embakasi North - Dandora / Kariobangi North",
    "Embakasi South - Bunyala Road / South B",
    "Embakasi South - Mombasa Road/Sameer Park/General Motors/ICD",
    "Embakasi South-Landimawe/KwaReuben/Kware/Pipeline",
    "Garden Estate/Thome/Marurui",
    "Gigiri/Village market/UN",
    "Githurai/Kahawa Sukari",
    "Hurlingham/DOD/Yaya center",
    "Huruma / Kiamaiko / Mbatini / Ngei",
    "Imara Daima/AA/Maziwa/Kwa Njenga",
    "Kahawa Wendani/ Kenyatta University",
    "Kahawa west/Githurai 44",
    "Kamukunji - Airbase/Mlango Kubwa",
    "Kamukunji - Eastleigh/California/Shauri Moyo",
    "Kamulu",
    "Karen",
    "Kariobangi South/Dandora/Airbase",
    "Kawangware/Stage 56",
    "Kilimani/State House/Denis Pritt",
    "Kinoo/Zambezi/Ngecha",
    "Kiserian/Corner Baridi/Ongata Rongai",
    "Korogocho / Baraka / Gitathuru / Grogan",
    "Langata/Hardy/Mbagathi",
    "Lavington/Mziima/James Gichuru",
    "Muthaiga/Parklands",
    "Ngara/Pangani",
    "Ngong/Kibiku",
    "Nyayo Highrise/Nairobi West",
    "Roy Sambu/Kasarani",
    "Ruai",
    "Ruiru",
    "Runda/Estate/Muthaiga",
    "Rwaka/Two Rivers",
    "South C",
    "Thindigua/Kasarini",
    "Umoja/Infill",
    "Utawala",
    "Valley Road / Community / Kenyatta Hospital",
    "Waiyaki Way/Kangemi",
    "Westlands",
    "Ziwani/Zimmerman/Githurai 45"
  ];

  return (
    <div className="component-body">
      <div className="brief-txt-header">Account Information</div>
      <div className="brief-txt">Enter the required information below for easy communication and access to account. You can change it anytime you want.</div>

      {/* Personal details section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Personal Details</h2>
          <button className="button-outline small-button" onClick={() => editMode.personalDetails ? handleSave('personalDetails') : toggleEditMode('personalDetails')}>
            {editMode.personalDetails ? 'Save' : (
              <>
                <PencilIcon className="pencil-icon" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <label className="lbl">Full Names</label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="inputField">
                  <input id="firstName" type="text" placeholder="First Name" value={userDetails.firstName} onChange={handleInputChange} disabled={!editMode.personalDetails} />
                </div>
              </div>
              <div>
                <div className="inputField">
                  <input id="lastName" type="text" placeholder="Last Name" value={userDetails.lastName} onChange={handleInputChange} disabled={!editMode.personalDetails} />
                </div>
              </div>
            </div>
            <div>
              <label className="lbl">Email Address</label>
              <div className="inputField">
                <input id="email" type="email" placeholder="Email Address" value={userDetails.email} onChange={handleInputChange} disabled={!editMode.personalDetails} />
              </div>
            </div>
            <div>
              <label className="lbl">Phone Number</label>
              <div className="inputField">
                <input id="phone" type="phone" placeholder="Phone Number" value={userDetails.phone} onChange={handleInputChange} disabled={!editMode.personalDetails} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account password section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Account Password</h2>
          <button className="button-outline small-button" onClick={() => editMode.accountPassword ? handleSave('accountPassword') : toggleEditMode('accountPassword')}>
            {editMode.accountPassword ? 'Save' : (
              <>
                <PencilIcon className="pencil-icon" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="brief-txt">Passwords are end-to-end encrypted. Use a strong password.</div>
        <div className="section-body">
          <div className="contain">
            {editMode.accountPassword ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="inputField">
                      <input id="oldPassword" type="password" placeholder="Enter Old Password" onChange={handleInputChange} />
                    </div>
                  </div>
                  <div>
                    <div className="inputField">
                      <input id="newPassword" type="password" placeholder="Enter New Password" onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="inputField">
                    <input id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleInputChange} />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="inputField">
                  <input id="password" type="password" placeholder="Enter Password" value="********" disabled />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shipping section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Shipping Address</h2>
          <button className="button-outline small-button" onClick={() => editMode.shippingAddress ? handleSave('shippingAddress') : toggleEditMode('shippingAddress')}>
            {editMode.shippingAddress ? 'Save' : (
              <>
                <PencilIcon className="pencil-icon" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <div>
              <label className="lbl">Location</label>
              <SelectField id="location" options={locations} value={userDetails.location} onChange={handleInputChange} disabled={!editMode.shippingAddress} />
            </div>
          </div>
        </div>
      </section>

      {/* Payment section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Payment Information</h2>
          <button className="button-outline small-button" onClick={() => editMode.paymentInformation ? handleSave('paymentInformation') : toggleEditMode('paymentInformation')}>
            {editMode.paymentInformation ? 'Save' : (
              <>
                <PencilIcon className="pencil-icon" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <label className="lbl">M-PESA Number</label>
            <div className="inputField">
              <input id="mpesaNumber" type="phone" placeholder="M-PESA Number" value={userDetails.mpesaNumber} onChange={handleInputChange} disabled={!editMode.paymentInformation} />
            </div>
          </div>
          <div className="available-payments">
            Current available payments :
            <div className="pay-icons">
              <img src="/mpesa.png" className="mpesa-logo" alt="M-Pesa" width={70} height={50} />
              <img alt="VISA" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" width="38" height="24" className="payment-icon" />
              <img alt="MASTERCARD" src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/ae9ceec48b1dc489596c.svg" width="38" height="24" className="payment-icon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function SelectField({ id, options, value, onChange, disabled }) {
  return (
    <div className="select-field">
      <label htmlFor={id}></label>
      <select id={id} value={value} onChange={onChange} disabled={disabled}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}