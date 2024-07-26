import { useState } from "react";
import "../../css/homepagecss/homepage.css";
import HLCont from "./HLCont";
const HLatest = () => {
  const [latestProducts, setLatestProducts] = useState([
    {
      productName: "Product Name",
      productPrice: "Kes: 500",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "Kes: 500",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "Kes: 500",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "Kes: 500",
      productId: Math.random(),
    },
  ]);
  return (
    <div className="h-latest">
      <div className="hl-titles">
        <h3>JUST IN</h3>
        <p>Explore Our Latest Products Just for you</p>
      </div>
      <div className="hl-div">
        <div className="hl-main-image">
          <img src="/l2.jpg" />
        </div>
        <div className="hl-sub-image">
          {latestProducts.map((a) => {
            return <HLCont productDetails={a} key={Math.random()} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default HLatest;
