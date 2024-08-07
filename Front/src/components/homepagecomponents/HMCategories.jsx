// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../css/homepagecss/homepage.css";

const HMCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://back-server-1.onrender.com/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigate to the products page with the selected category
    navigate(`/products?category=${category}`);
  };

  // Limit to 4 categories
  const displayedCategories = categories.slice(0, 4);

  return (
    <div className="home-catergories">
      <h3>Explore our categories</h3>
      <ul className="hc-div">
        {displayedCategories.map(category => (
          <li 
            key={category.id} 
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HMCategories;
