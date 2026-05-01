import React from "react";
import Business from "../../../assets/img/Feature_2.png";
import Button from "../../ui/Button";

const Herosection: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center p-6 gap-12">
            <div className="md:w-full flex justify-center">
              <img
                src={Business}
                alt="Macbook image"
                className="max-h-[600px] w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="md:w-3xl text-center md:text-left">
              <div className="mb-5">
                <h1 className="text-[var(--primary)] text-2xl md:text-2xl font-bold">
                  GROW YOUR BUSINESS
                </h1>
                <h2 className="text-gray-400 text-xl font-semibold">
                  With payments & CRM funtionality
                </h2>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  In-App Payments
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Set up direct debits or take manual payments from parent app
                </p>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Maximise Enrolments
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Guide families from enquiry through to enrolment with our
                  built-in CRM software
                </p>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Manage Occupancy
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Take casual booking and manage occupancy from within the
                  portal
                </p>
              </div>

              <div className="flex justify-center">
                <Button variant="primary">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Herosection;
