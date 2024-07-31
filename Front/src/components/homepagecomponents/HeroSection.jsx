import { useNavigate } from "react-router-dom";
import "../../css/homepagecss/homepage.css";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleNavigate = async () =>{
    navigate("/products");
  }
  return (
    <div className="hero-section">
      <section className="hero-details-section">
        <h1>Craft Your Legacy with Kletos</h1>
        <p>
        &quot;Find artifacts that shimmer and radiate confidence, just like you. 
          Discover your perfect Kletos artifacts today.&quot;
        </p>
        <button onClick={handleNavigate}>Explore</button>
      </section>
      <section className="hero-image-section flex">
        <img src="/heroimage.jpeg" />
      </section>
    </div>
  );
};

export default HeroSection;
