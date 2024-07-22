// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

export default function MyAccount() {

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
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
      <div className="brief-txt-header">User Information</div>
      <div className="brief-txt">Enter the required information below for easy communication and access to account. You can change it anytime you want.</div>

      {/* Personal details section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Personal Details</h2>
          <button className="button-outline small-button">
            <PencilIcon className="pencil-icon" />
            Edit
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <label className="lbl">Full Names</label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                {/* <label className="lbl">Full Name</label> */}
                <div className="inputField">
                  <input id="firstName" type="text" placeholder="First Name" />
                </div>
              </div>
              <div>
                <label className="lbl"></label>
                <div className="inputField">
                  <input id="lastName" type="text" placeholder="Last Name" />
                </div>
              </div>
            </div>
            <div>
              <label className="lbl">Address</label>
              <div className="inputField">
                <input id="email" type="email" placeholder="Email Address" />
              </div>
            </div>
            <div>
              {/* <label className="lbl">Phone Number</label> */}
              <div className="inputField">
                <input id="phone" type="phone" placeholder="Phone Number" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account password section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Account Password</h2>
          <button className="button-outline small-button" onClick={toggleEditMode}>
            {editMode ? 'Save' : (
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
            {editMode ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    {/* <label className="lbl">Old Password</label> */}
                    <div className="inputField">
                      <input id="oldPassword" type="password" placeholder="Enter Old Password" />
                    </div>
                  </div>
                  <div>
                    {/* <label className="lbl">New Password</label> */}
                    <div className="inputField">
                      <input id="newPassword" type="password" placeholder="Enter New Password" />
                    </div>
                  </div>
                </div>
                <div>
                  {/* <label className="lbl">Confirm Password</label> */}
                  <div className="inputField">
                    <input id="confirmPassword" type="password" placeholder="Confirm Password" />
                  </div>
                </div>
              </>
            ) : (
              <div>
                {/* <label className="lbl">Password</label> */}
                <div className="inputField">
                  <input id="password" type="password" placeholder="Enter Password" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shipping section  */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Shipping Address</h2>
          <button className="button-outline small-button">
            <PencilIcon className="pencil-icon" />
            Edit
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <div>
              <label className="lbl">Location</label>
              <SelectField id="location" options={locations} />
            </div>
          </div>
        </div>
      </section>

      {/* Payment section  */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Payment Information</h2>
          <button className="button-outline small-button">
            <PencilIcon className="pencil-icon" />
            Edit
          </button>
        </div>
        <div className="section-body">
          <div className="contain">
            <label className="lbl">M-PESA Number</label>
            <div className="inputField">
              <input id="phone" type="phone" placeholder="M-PESA Number" />
            </div>
          </div>
          <div className="available-payments">
            Current available payments :
            <img src="/mpesa.png" className="mpesa-logo" alt="M-Pesa" width={70} height={50} />
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

function SelectField({ id, options }) {
  return (
    <div className="select-field">
      <label htmlFor={id}></label>
      <select id={id}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}