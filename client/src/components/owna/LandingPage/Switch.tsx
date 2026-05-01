import React from "react";
import Fet3 from "../../../assets/img/Feature_3.png";
import Button from "../../ui/Button";

const Switch: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center p-6 gap-12">
            <div className="md:w-3xl text-center md:text-left">
              <div className="mb-5">
                <h1 className="text-[var(--primary)] text-2xl md:text-2xl font-bold">
                  SWITCH TO OWNA
                </h1>
                <h2 className="text-gray-400 text-xl font-semibold">
                  In just 5 days
                </h2>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Export your Data
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  With our suite of guides for each major software provider
                </p>
              </div>

              <div className="mb-5">
                <h2 className="text-[var(--pink)] text-lg font-bold">
                  Hand It Over To Our Team
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  And we'll do the rest
                </p>
              </div>

              <div className="flex justify-center">
                <Button variant="primary">Chat To Our Team</Button>
              </div>
            </div>

            <div className="md:w-full flex justify-center">
              <img
                src={Fet3}
                alt="Switch image"
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

export default Switch;
