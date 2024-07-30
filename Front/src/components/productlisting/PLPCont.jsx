// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/productlistingcss/productlisting.css";

// eslint-disable-next-line react/prop-types
const PLPCont = ({ productId, productName, price, imageUrl }) => {
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

      const response = await fetch(`http://127.0.0.1:5000/cart/add`, {
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
    <div className="plp-cont">
      <Link to={`/products/${productId}`}  className="plpc-image">
        <img src={imageUrl} alt={productName} className="plpc-image-img" />
      </Link>
      <div className="plpc-details">
        <div className="plpcd-details">
          <h3>{productName}</h3>
          <span>Kes: {price}</span>
        </div>
        <div className="plpcd-btn">
          <button onClick={addToCart} disabled={addingToCart}>
            {addingToCart ? 'Adding...' : 'Add To Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PLPCont;
