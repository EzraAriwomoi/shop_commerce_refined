/* eslint-disable react/prop-types */
const RPCont = ({ details }) => {
  return (
    <a href="#" className="rp-cont">
      <div className="rpc-image">
      <img src="ring.jpeg"/>
      </div>
      <div className="rpc-details">
        <h3>{details.productName}</h3>
        <span>{details.productPrice}</span>
      </div>
    </a>
  );
};

export default RPCont;
