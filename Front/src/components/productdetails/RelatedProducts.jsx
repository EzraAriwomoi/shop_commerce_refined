/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/productdetails/productdetails.css";

const RelatedProducts = ({ products }) => {
  // State to manage adding to cart and wishlist status
  const [addingToCart, setAddingToCart] = useState(null);
  const [wishlistStatuses, setWishlistStatuses] = useState({});

  useEffect(() => {
    // Fetch wishlist statuses for all products when component mounts
    const fetchWishlistStatuses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const statuses = await Promise.all(products.map(async (product) => {
          const response = await fetch(`https://back-server-1.onrender.com/wishlist/check/${product.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            return { productId: product.id, exists: data.exists };
          } else {
            return { productId: product.id, exists: false };
          }
        }));

        setWishlistStatuses(statuses.reduce((acc, { productId, exists }) => {
          acc[productId] = exists;
          return acc;
        }, {}));
      } catch (error) {
        console.error('Error checking wishlist statuses:', error);
      }
    };

    fetchWishlistStatuses();
  }, [products]);

  const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('You need to be logged in to add items to the cart.');
      return;
    }

    setAddingToCart(productId);
    
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
      setAddingToCart(null);
    }
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to be logged in to manage the wishlist.');
        return;
    }

    try {
        const method = wishlistStatuses[productId] ? 'DELETE' : 'POST';
        const response = await fetch(`https://back-server-1.onrender.com/wishlist/${productId}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        // Update wishlist status in the state
        setWishlistStatuses(prev => ({
          ...prev,
          [productId]: !prev[productId]
        }));
    } catch (error) {
        console.error('Error managing wishlist:', error);
        alert('Failed to manage wishlist.');
    }
  };

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  if (!products.length) return null;

  const shuffledProducts = shuffleArray(products);

  return (
    <section className="related-products">
      <div className="rp-title">
        <h2>You May Also Like</h2>
      </div>
      <div className="related-products-list">
        {shuffledProducts.map((product) => (
          <div key={product.id} className="related-product-item">
            <Link to={`/products/${product.id}`}>
              <img src={product.image_url} alt={product.name} />
              <div className="related-product-info">
                <h3>{product.name}</h3>
                <p>Ksh. {product.price}</p>
              </div>
            </Link>
            <div className="row-wish-addcart">
              <button 
                className="addcart-details" 
                onClick={() => addToCart(product.id)} 
                disabled={addingToCart === product.id}
              >
                {addingToCart === product.id ? 'Adding...' : 'Add To Cart'}
              </button>
              <button
                className="btn-heart-productdetails"
                onClick={() => toggleWishlist(product.id)}
                title={wishlistStatuses[product.id] ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill={wishlistStatuses[product.id] ? "#8b4513" : "#37373762"}
                >
                  {wishlistStatuses[product.id] ? (
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                  ) : (
                    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
