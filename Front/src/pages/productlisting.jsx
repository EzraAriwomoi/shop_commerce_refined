// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import ProductCard from "../pages/components/productcard/productcard";
import { Frame } from "../pages/components/frame";
import { Frame2 } from "../pages/components/frame";
import "../css/productlistingcss/productlisting.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import Component from "../components/slide";

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://hp7p5v0d-5000.inc1.devtunnels.ms/products/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <NavBar />
            <div className="product-list-page">
                <div className="div-2">
                    <div>
                        <Frame className="" />
                        <Frame2 className="" />
                    </div>
                    <div className="divider1"></div>
                    <div className="frame-2">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                productId={product.id}
                                productName={product.name}
                                price={product.price}
                                imageUrl={product.image_url}
                            />
                        ))}
                    </div>
                    {/* Component integration */}
                    <div className="frame-5">
                        <Component />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductListing;
