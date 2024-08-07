// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/productlistingcss/productlisting.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/NavBar";
import PLPCont from "../components/productlisting/PLPCont";

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const category = searchParams.get('category');

        let url = 'https://back-server-1.onrender.com/products/';
        if (category) {
            url += `?category=${category}`;
        }

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                shuffleArray(data); // Shuffle the array before setting the state
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const categoryName = new URLSearchParams(location.search).get('category') || 'Products';

    return (
        <>
            <div>
                <Navbar />
                <div className="product-listing-page">
                    <div className="plp-header">
                        <h3>{categoryName}</h3>
                        <ul>
                            <button>Newest</button>
                            <button>Popular</button>
                        </ul>
                    </div>
                    <div className="plp-div">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <PLPCont
                                    key={product.id}
                                    productId={product.id}
                                    productName={product.name}
                                    price={product.price}
                                    imageUrl={product.image_url}
                                />
                            ))
                        ) : (
                            <p>No products available in this category.</p>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ProductListing;
