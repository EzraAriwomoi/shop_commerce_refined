import { useState } from "react";
import FPContainer from "./FPContainer";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([
    {
      productName: "Rings",
      imageSrc: "public/handbrace.jpg",
    },
    {
      productName: "Necklace",
      imageSrc: "public/3 (copy 1).jpg",
    },
    {
      productName: "Rings",
      imageSrc: "public/26.jpg",
    },
    {
      productName: "Necklace",
      imageSrc: "public/22.jpg",
    },
  ]);

  return (
    <div className="featured-products">
      <h3>Featured Products</h3>
      <div className="fp-div">
        {products.map((a) => {
          return <FPContainer productDetails={a} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
