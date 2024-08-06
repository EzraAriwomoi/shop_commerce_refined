/* eslint-disable react/prop-types */
import "../../css/homepagecss/homepage.css";

const HLCont = ({ productDetails, onClick }) => {
  return (
    <div className="hl-cont" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="hlc-image">
        <img
          src={productDetails.productImage}
          className="hlci-img"
          alt={productDetails.productName}
        />
      </div>
      <div className="hlc-details">
        <h3>{productDetails.productName}</h3>
        <span>{productDetails.productPrice}</span>
      </div>
    </div>
  );
};

export default HLCont;
