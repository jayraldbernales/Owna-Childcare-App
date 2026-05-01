import React from "react";
import service from "../../../assets/img/Feature_1.png";
import Button from "../../ui/Button";

const Herosection: React.FC = () => {
  return (
    <div id="service" className="min-h-screen flex flex-col bg-white pt-20">
      <main className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center p-6 gap-12">
            <div className="md:w-3xl text-center md:text-left">
              <div className="mb-5">
                <h1 className="text-[var(--primary)] text-2xl md:text-2xl font-bold">
                  MANAGE YOUR SERVICE
                </h1>
                <h2 className="text-gray-400 text-xl font-semibold">
                  From One Central Location
                </h2>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Build Relationships With Families
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Keep parents updated on-the-go within the intuitive,
                  user-friendly parent app
                </p>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Manage Staff Effectively
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Utilise the portal and educator app for seamless educator
                  management
                </p>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-xl font-bold">
                  Efficient Documentation
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Allow educators to spend more quality time with children
                  whilst prioritising development through customisable learning
                  documentation and programming
                </p>
              </div>

              <div className="flex justify-center">
                <Button variant="primary">Book a Demo</Button>
              </div>
            </div>

            <div className="md:w-full flex justify-center">
              <img
                src={service}
                alt="Macbook image"
                className="max-h-[700px] w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Herosection;
