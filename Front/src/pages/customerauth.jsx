//css
import "../css/customerauthcss/customerauthpage.css";
//pages
import CustomerSignInComponent from "../components/customerauthcomponents/CustomerSignInComponent";
import CustomerRegisterComponent from "../components/customerauthcomponents/CustomerRegisterComponent";
import { useState } from "react";

const customerauth = () => {
  //Helps toggle the components
  const [toggle, setToggle] = useState(false);

  return (
    <div className="customer-auth-page flex-col">
      {toggle ? (
        <CustomerRegisterComponent onToggle={(e) => setToggle(!toggle)} />
      ) : (
        <CustomerSignInComponent onToggle={(e) => setToggle(!toggle)} />
      )}
    </div>
  );
};

export default customerauth;
