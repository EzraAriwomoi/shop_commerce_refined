import "../css/homepagecss/homepage.css";

//components
import HeroSection from "../components/homepagecomponents/HeroSection";
import HMCategories from "../components/homepagecomponents/HMCategories";
// import FPContainer from "../components/homepagecomponents/FPContainer";
import FeaturedProducts from "../components/homepagecomponents/FeaturedProducts";
import HMExplore from "../components/homepagecomponents/HMExplore";
import NavBar from "../components/layout/NavBar";
import NavBar2 from "../components/layout/NavBar2";
import Footer from "../components/layout/Footer";

const homepage = () => {
  return (
    <>
      <div className="home-page">
        <NavBar />
        <HeroSection />
        <HMCategories />
        <FeaturedProducts />
        <HMExplore />
        <Footer />
      </div>
    </>
  );
};

export default homepage;
