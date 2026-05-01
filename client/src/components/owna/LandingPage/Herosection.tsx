import React from "react";
import { Link } from "react-router-dom";
import macbook from "../../../assets/img/macbook.png";
import captera from "../../../assets/img/captera.png";
import sector from "../../../assets/img/sector.png";
import banner from "../../../assets/img/banner.png";

import Button from "../../ui/Button";

const Herosection: React.FC = () => {
  return (
    <div
      id="home"
      className="min-h-screen flex flex-col pt-25 bg-cover bg-center"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <main className="flex-1 flex items-center py-6 px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-[var(--primary)] text-4xl md:text-4xl font-bold mb-6">
                Simplifying Childcare <br /> Management
              </h1>
              <p className="text-xl font-bold text-gray-500  mb-8">
                Stress-free childcare software for busy centres
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="secondary">Book a Demo</Button>
                <Link to="/signup">
                  <Button variant="primary"> Sign Up </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-full flex justify-center">
              <img
                src={macbook}
                alt="Macbook image"
                className="max-h-[480px] w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>
      <div className="mb-35 flex justify-center">
        <div className="flex gap-12 items-center">
          <a
            href="https://www.capterra.com.au/reviews/209399/owna"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={captera}
              alt="captera image"
              className="max-h-[68px] object-contain"
              loading="lazy"
            />
          </a>
          <a
            href="https://thesector.com.au/2021/09/14/the-sector-launches-new-child-care-management-system-guide-as-it-builds-on-its-report-writing-stream/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={sector}
              alt="sector image"
              className="max-h-[68px] object-contain"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Herosection;
