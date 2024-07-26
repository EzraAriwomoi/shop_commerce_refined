import "../../css/homepagecss/homepage.css";

const HomeVideo = () => {
  return (
    <div className="home-video">
      <video autoPlay width="600" className="hv-video">
        <source src={"/videos/1.mov"} type={"video/mov"} />
        Your browser does not support the video tag.
      </video>
      <div className="hv-title">
        <h1>
          Made In Kenya, With Your <br /> Style in Mind
        </h1>
      </div>
    </div>
  );
};

export default HomeVideo;
