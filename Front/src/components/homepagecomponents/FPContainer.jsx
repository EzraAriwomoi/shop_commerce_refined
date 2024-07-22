const FPContainer = ({ productDetails }) => {
  return (
    <div className="fp-container flex-col">
      <div className="fpc-image">
        <img src={productDetails.imageSrc} />
      </div>
      <div className="fpc-details flex">
        <span>{productDetails.productName}</span>
      </div>
    </div>
  );
};

export default FPContainer;
