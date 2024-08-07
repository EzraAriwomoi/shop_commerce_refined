import "../css/aboutuscss/aboutus.css";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

const AboutPage = () => {
  return (
    <>
      <NavBar />
      <div className="about-page">
        <header className="about-header">
          <h1>Kletos</h1>
          <p>Crafting Unique Pieces Since 1970</p>
        </header>

        <section className="our-story">
          <h2 className="headers-about">Our Story</h2>
          <div className="story-content">
            <img
              src="/zuOPV13g-scaled.jpeg"
              alt="Our Workshop"
              className="story-image"
            />
            <p>
              Welcome to Kletos, where we connect local artisans to the world.
              Discover unique, handcrafted products like necklaces and
              calabashes, celebrating the rich heritage and craftsmanship of our
              talented local creators. Join us in supporting and sharing their
              stories, as we showcase their passion through every meticulously
              crafted piece.
            </p>
          </div>
        </section>

        <section className="our-process">
          <h2 className="headers-about">Our Process</h2>
          <div className="process-steps">
            <div className="step">
              <h3>1. Consultation</h3>
              <p>
                We begin with a one-on-one consultation to understand your
                vision and preferences.
              </p>
            </div>
            <div className="step">
              <h3>2. Design</h3>
              <p>
                Our designers create a custom sketch based on your ideas and our
                expertise.
              </p>
            </div>
            <div className="step">
              <h3>3. Crafting</h3>
              <p>
                Our skilled artisans bring the design to life using the finest
                materials.
              </p>
            </div>
            <div className="step">
              <h3>4. Perfection</h3>
              <p>
                We meticulously refine every detail to ensure your piece is
                flawless.
              </p>
            </div>
          </div>
        </section>

        <section className="our-team">
          <h2 className="headers-about">Meet Our Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img
                src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                alt="Jane Smith"
              />
              <h3>Ezra</h3>
              <p>Founder & Master Jeweler</p>
            </div>
            <div className="team-member">
              <img
                src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                alt="John Doe"
              />
              <h3>Rone Beatrice</h3>
              <p>Lead Designer</p>
            </div>
            <div className="team-member">
              <img
                src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                alt="Emma Johnson"
              />
              <h3>Consolata</h3>
              <p>Customer Experience Manager</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;