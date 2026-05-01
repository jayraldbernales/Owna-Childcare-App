import React from "react";
import Herosection from "../components/owna/LandingPage/Herosection";
import Service from "../components/owna/LandingPage/Service";
import Business from "../components/owna/LandingPage/Business";
import Switch from "../components/owna/LandingPage/Switch";
import Trusted from "../components/owna/LandingPage/Trusted";
import Pricing from "../components/owna/LandingPage/Pricing";
import Navbar from "../components/owna/LandingPage/LandingPageNavbar";
import Contact from "../components/owna/LandingPage/Contact";

const LandingPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Herosection />
      <Service />
      <Business />
      <Switch />
      <Trusted />
      <Pricing />
      <Contact />
    </div>
  );
};

export default LandingPage;
