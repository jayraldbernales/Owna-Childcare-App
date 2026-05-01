import React from "react";
import recommended from "../../../assets/img/recommend.png";
import value from "../../../assets/img/value.png";
import support from "../../../assets/img/support.png";
import shape from "../../../assets/img/Shape3.png";

const Trusted: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[length:100%_100%] bg-center"
      style={{ backgroundImage: `url(${shape})` }}
    >
      <main className="text-center px-4">
        <h2 className="text-[var(--primary)] text-4xl md:text-4xl font-bold mb-6">
          Trusted by Over 2,500 Services
        </h2>
        <div className="flex justify-center items-center gap-6 mb-6 flex-wrap">
          <img
            src={recommended}
            alt="Most Recommended 2021"
            className="w-40 md:w-56"
            loading="lazy"
          />
          <img
            src={value}
            alt="Best Value 2021"
            className="w-40 md:w-42"
            loading="lazy"
          />
          <img
            src={support}
            alt="Best Customer Support 2021"
            className="w-40 md:w-56"
            loading="lazy"
          />
        </div>

        <p className="text-xl font-bold text-gray-500  mb-8">
          Australia's most comprehensive app for early education.
        </p>
        <button className="border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-3 rounded-full text-lg font-bold transition-colors hover:bg-[var(--primary)] hover:text-white">
          Join Now
        </button>
      </main>
    </div>
  );
};

export default Trusted;
