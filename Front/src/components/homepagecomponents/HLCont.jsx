import "../../css/homepagecss/homepage.css";

const HLCont = ({productDetails}) => {
  return (
    <div className="hl-cont">
      <div className="hlc-image">
        <img src="/ring.jpeg" className="hlci-img" />
      </div>
      <div className="hlc-details">
        <h3>{productDetails.productName}</h3>
        <span>{productDetails.productPrice}</span>
      </div>
    </div>
  );
};

export default HLCont;
