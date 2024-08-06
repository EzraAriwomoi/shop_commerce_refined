import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/homepagecss/homepage.css";

const HFeaturedLinks = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRandomCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/products/random-categories'); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch random categories');
        }
      } catch (error) {
        console.error('Error fetching random categories:', error);
      }
    };

    fetchRandomCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Navigate to the products page with the selected category
    navigate(`/products?category=${categoryName}`);
  };

  return (
    <div className="h-featured-links">
      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className="hfl-link"
            style={{ backgroundImage: `url(${category.image_url})` }}
            onClick={() => handleCategoryClick(category.name)} // Add click handler
          >
            <a href="#">
              <h3>View {category.name}</h3>
            </a>
          </div>
        ))
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default HFeaturedLinks;
