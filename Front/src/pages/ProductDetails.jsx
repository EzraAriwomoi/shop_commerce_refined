// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import RelatedProducts from "../components/productdetails/RelatedProducts";
import "../css/productdetails/productdetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [wishlist, setWishlist] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://back-server-1.onrender.com/products/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data);
                setLoading(false);
                
                // Fetch related products
                const relatedResponse = await fetch(`https://back-server-1.onrender.com/products/related/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!relatedResponse.ok) {
                    throw new Error(`HTTP error! status: ${relatedResponse.status}`);
                }

                const relatedData = await relatedResponse.json();
                setRelatedProducts(relatedData);

            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchWishlistStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`https://back-server-1.onrender.com/wishlist/check/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWishlist(data.exists);
                } else {
                    setWishlist(false);
                }
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };

        fetchWishlistStatus();
    }, [id]);

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
                body: JSON.stringify({ user_id, product_id: product.id, quantity: 1 }),
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

    const toggleWishlist = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You need to be logged in to manage the wishlist.');
            return;
        }

        try {
            const response = await fetch(`https://back-server-1.onrender.com/wishlist/${product.id}`, {
                method: wishlist ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: product.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            setWishlist(!wishlist);
        } catch (error) {
            console.error('Error managing wishlist:', error);
            alert('Failed to manage wishlist.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <NavBar />
            <div className="product-details">
                <div className="pd-cont">
                    <section className="pd-image-cont">
                        <img src={product.image_url} alt={product.name} />
                    </section>
                    <section className="pd-details">
                        <div className="pdd-titles">
                            <h1>{product.name}</h1>
                            <h2>
                                <span>Ksh: {product.price}</span>
                            </h2>
                        </div>
                        <p>
                            {product.description}
                        </p>
                        <div className="row-btn">
                            <button className="btn-addcart" onClick={addToCart} disabled={addingToCart}>
                                <div className="lbladd-cart">{addingToCart ? 'Adding...' : 'Add to Cart'}</div>
                            </button>
                            <button
                                className="btn-heart"
                                onClick={toggleWishlist}
                                title={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    fill={wishlist ? "#8b4513" : "#8b4513"}
                                >
                                    {wishlist ? (
                                        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                    ) : (
                                        <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </section>
                </div>
                <RelatedProducts products={relatedProducts} />
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;
