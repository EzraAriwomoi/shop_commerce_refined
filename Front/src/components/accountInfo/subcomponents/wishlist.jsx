// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/myaccount/wishlist.css";

const SavedItems = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://back-server-1.onrender.com/wishlist/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const sortedItems = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setWishlistItems(sortedItems);
      })
      .catch(error => console.error('Error fetching wishlist:', error));
  }, []);

  const handleRemove = (productId) => {
    fetch(`https://back-server-1.onrender.com/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
        } else {
          return response.json().then(error => { throw new Error(error.error); });
        }
      })
      .catch(error => console.error('Error removing item from wishlist:', error));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const hasItems = wishlistItems.length > 0;

  return (
    <section className="sect-wishlist">
      <div className={`card-wishlist ${!hasItems ? 'no-items' : ''}`}>
        {hasItems && (
          <header className="header-wishlist">
            <h2 className="saved_head">Saved items</h2>
          </header>
        )}
        <div className={`rowpass-wish ${!hasItems ? 'empty' : ''}`}>
          {hasItems ? (
            wishlistItems.map(item => (
              <article className="article-wishlist" key={item.product_id}>
                <a
                  href={`/product-details/${item.product_id}`}
                  className="linkimg-wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProductClick(item.product_id);
                  }}
                >
                  <img
                    src={item.image_url}
                    className="imgprod"
                    alt={item.product_name}
                  />
                </a>
                <div className="details-produ">
                  <div className="nameproduct">{item.product_name}</div>
                  <div className="priceitem">Ksh: {item.product_price}</div>
                </div>
                <div className="btns">
                  <button className="btnremove" onClick={() => handleRemove(item.product_id)}>
                    <svg
                      className="bin"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                    Remove
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="no-items">
              <img
                src="saved-item.jpg"
                alt="No items in wishlist"
                className="no-items-img"
              />
              <p className="no-items-text">You haven&apos;t saved an item yet!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedItems;
