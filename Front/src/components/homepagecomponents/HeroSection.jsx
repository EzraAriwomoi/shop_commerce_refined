import "../../css/homepagecss/homepage.css";

const HeroSection = () => {
  return (
    <div className="hero-section flex">
      <section className="hero-details-section">
        <h1>Kletos Jewelry for Every Chapter</h1>
        <p>Find pieces that shimmer and radiate confidence, just like you.</p>
        <button>Explore</button>
      </section>
      <section className="hero-image-section flex">
        <img src="/heroimage.jpeg" />
      </section>
    </div>
  );
};

export default HeroSection;
