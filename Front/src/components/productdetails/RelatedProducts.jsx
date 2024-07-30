import React, { useState } from "react";
import RPCont from "./RPCont";

const RelatedProducts = () => {
  const [relatedProducts, setRelatedProducts] = useState([
    {
      productName: "Product Name",
      productPrice: "KSh. 00.00",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "KSh. 00.00",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "KSh. 00.00",
      productId: Math.random(),
    },
    {
      productName: "Product Name",
      productPrice: "KSh. 00.00",
      productId: Math.random(),
    },
  ]);
  return (
    <div className="related-products-div">
      <div className="rp-title">
        <h2>You May Also Like</h2>
      </div>
      <div className="rp-div">
        {relatedProducts.map((a) => {
          return <RPCont details={a} key={a.productId} />;
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
