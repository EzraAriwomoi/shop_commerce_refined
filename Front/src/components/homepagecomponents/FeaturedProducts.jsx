import { useState } from "react";
import FPContainer from "./FPContainer";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([
    {
      productName: "Rings",
      imageSrc: "/ring.jpeg",
    },
    {
      productName: "Necklace",
      imageSrc: "/necklace.jpeg",
    },
    {
      productName: "Rings",
      imageSrc: "/ring.jpeg",
    },
    {
      productName: "Necklace",
      imageSrc: "/necklace.jpeg",
    },
  ]);

  return (
    <div className="featured-products">
      <h3>Featured Products</h3>
      <p>Selected Just for your Style & Looks</p>
      <div className="fp-div">
        {products.map((a) => {
          return <FPContainer productDetails={a} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
