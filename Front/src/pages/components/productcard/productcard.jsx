// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../../../css/productlistingcss/productlisting.css";

const ProductCard = ({ productId, productName, price, imageUrl }) => {
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('You need to be logged in to add items to the cart.');
      return;
    }

    setAddingToCart(true);
    
    try {
      const user_id = localStorage.getItem('user_id');

      const response = await fetch(`https://back-server-1.onrender.com/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id, product_id: productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart. HTTP status ${response.status}`);
      }

      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="plp-card">
      <Link to={`/products/${productId}`} className="plp-image">
        <img src={imageUrl} alt={productName} />
      </Link>
      <div className="plp-details">
        <div className="plpd-details">
          <h4>{productName}</h4>
          <span>Kes: {price}</span>
        </div>
        <div className="plpd-btn">
          <button disabled={addingToCart} onClick={addToCart}>
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default ProductCard;
