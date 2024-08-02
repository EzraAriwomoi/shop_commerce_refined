import "../css/homepagecss/homepage.css";

//components
import HeroSection from "../components/homepagecomponents/HeroSection";
import HMCategories from "../components/homepagecomponents/HMCategories";
// import FPContainer from "../components/homepagecomponents/FPContainer";
import FeaturedProducts from "../components/homepagecomponents/FeaturedProducts";
// import HMExplore from "../components/homepagecomponents/HMExplore";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";
import HomeVideo from "../components/homepagecomponents/HomeVideo";
import HLatest from "../components/homepagecomponents/HLatest";
import HFeaturedLinks from "../components/homepagecomponents/HFeaturedLinks";

const homepage = () => {
  return (
    <>
      <div className="home-page">
        <NavBar />
        <HeroSection />
        <HMCategories />
        <FeaturedProducts />
        <HomeVideo />
        <HLatest />
        <HFeaturedLinks />
        <Footer />
      </div>
    </>
  );
};

export default homepage;
