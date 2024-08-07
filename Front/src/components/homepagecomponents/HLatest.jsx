import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/homepagecss/homepage.css";
import HLCont from "./HLCont";

const HLatest = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomLatestProducts = async () => {
      try {
        const response = await fetch('https://back-server-1.onrender.com/products/random-latest-products');
        if (response.ok) {
          const data = await response.json();
          setLatestProducts(data);
        } else {
          console.error('Failed to fetch random latest products');
        }
      } catch (error) {
        console.error('Error fetching random latest products:', error);
      }
    };

    fetchRandomLatestProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="h-latest">
      <div className="hl-titles">
        <h3>JUST IN</h3>
        <p>Explore Our Latest Products Just for you</p>
      </div>
      <div className="hl-div">
        <div className="hl-main-image">
          <img src="/l2.jpg" alt="Main" />
        </div>
        <div className="hl-sub-image">
          {latestProducts.map((product) => (
            <HLCont
              key={product.id}
              productDetails={{
                productName: product.name,
                productPrice: `Ksh: ${product.price}`,
                productImage: product.image_url,
              }}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HLatest;
