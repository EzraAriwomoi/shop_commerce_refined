import "../../css/homepagecss/homepage.css";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <section className="hero-details-section">
        <h1>Craft Your Legacy with Kletos</h1>
        <p>
          "Find pieces that shimmer and radiate confidence, just like you.
          Discover your perfect Kletos jewelry today."
        </p>
        <button>Explore</button>
      </section>
      <section className="hero-image-section flex">
        <img src="/heroimage.jpeg" />
      </section>
    </div>
  );
};

export default HeroSection;
