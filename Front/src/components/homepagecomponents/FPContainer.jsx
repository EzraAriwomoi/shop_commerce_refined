/* eslint-disable react/prop-types */
import "../../css/homepagecss/homepage.css";

const FPContainer = ({ productDetails, onClick }) => {
  return (
    <div className="fp-container flex-col" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="fpc-image">
        <img src={productDetails.imageSrc} alt={productDetails.productName} />
      </div>
      <div className="fpc-details">
        <span>{productDetails.productName}</span>
      </div>
    </div>
  );
};

export default FPContainer;
