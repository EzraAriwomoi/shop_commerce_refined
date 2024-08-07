import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FPContainer from "./FPContainer";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('https://back-server-1.onrender.com/products/featured-products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch featured products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (productId) => {
    // Navigate to the product details page with the selected product ID
    navigate(`/products/${productId}`);
  };

  return (
    <div className="featured-products">
      <h3>Featured Products</h3>
      <p>Selected Just for your Style & Looks</p>
      <div className="fp-div">
        {products.map((product) => (
          <FPContainer
            key={product.id}
            productDetails={{
              productName: product.name,
              imageSrc: product.image_url,
            }}
            onClick={() => handleProductClick(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
