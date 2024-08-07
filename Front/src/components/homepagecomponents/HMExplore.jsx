import "../../css/homepagecss/homepage.css";

const HMExplore = () => {
  return (
    <div className="flex home-explore">
      <section className="he-image">
        <img src="/exploreimage.jpeg" />
      </section>
      <section className="he-details">
        <h1>Breathtakingly Beautiful</h1>
        <p>Unleash your story&apos;s sparkle. Find your perfect jewel here.</p>
        <button>Explore</button>
      </section>
    </div>
  );
};

export default HMExplore;
