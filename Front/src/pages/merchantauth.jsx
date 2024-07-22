import { useState } from "react";
//css
import "../css/merchantauthcss/merchantauthpage.css";

//pages
import MerchantLogin from "../components/merchantauthcomponents/MerchantLogin";
import MerchantSignUp from "../components/merchantauthcomponents/MerchantSignUp";

const merchantauth = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="merchant-auth-page flex-col">
      {toggle ? <MerchantSignUp /> : <MerchantLogin />}
    </div>
  );
};

export default merchantauth;
