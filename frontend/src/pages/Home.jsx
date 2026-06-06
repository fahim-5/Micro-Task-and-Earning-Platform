import HeroSlider from "../components/HeroSlider";
import BestWorkers from "../components/BestWorkers";
import Testimonials from "../components/Testimonials";
import ExtraSections from "../components/ExtraSections";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <BestWorkers />
      <Testimonials />
      <ExtraSections />
    </div>
  );
};

export default Home;
