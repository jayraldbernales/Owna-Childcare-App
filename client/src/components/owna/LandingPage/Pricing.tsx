import React from "react";
import {
  FaBaby,
  FaBabyCarriage,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaCircle,
} from "react-icons/fa";

type FeatureType = "included" | "excluded" | "partial";

interface Feature {
  name: string;
  type: FeatureType;
}

interface FeatureListProps {
  features: Feature[];
  color: string;
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <ul className="text-left space-y-3 mb-3">
      {features.map((feature, index) => {
        let icon;
        let textColor;

        switch (feature.type) {
          case "included":
            icon = (
              <FaCheckCircle className="text-[var(--primary)] mr-2 mt-0.5 flex-shrink-0" />
            );
            textColor = "text-[var(--primary)]";
            break;
          case "excluded":
            icon = (
              <FaTimesCircle className="text-[var(--pink)] mr-2 mt-0.5 flex-shrink-0" />
            );
            textColor = "text-[var(--pink)]";
            break;
          case "partial":
          default:
            icon = (
              <FaCircle className="text-[var(--yellow)] mr-2 mt-0.5 flex-shrink-0" />
            );
            textColor = "text-[var(--yellow)]";
            break;
        }

        return (
          <li key={index} className="flex items-start">
            {icon}
            <span className={textColor}>{feature.name}</span>
          </li>
        );
      })}
    </ul>
  );
};

const Pricing: React.FC = () => {
  const liteFeatures: Feature[] = [
    { name: "Curriculum Planning", type: "included" },
    { name: "Compliance", type: "included" },
    { name: "Rostering & Timesheets", type: "included" },
    { name: "Attendances (Sign-In/Out)", type: "included" },
    { name: "CCS, Accounts & Billing", type: "excluded" },
    { name: "Reporting (Funding Only)", type: "partial" },
    { name: "Enrolment Forms", type: "included" },
    { name: "Email Campaigns", type: "excluded" },
    { name: "Multi-Site Management", type: "excluded" },
    { name: "API", type: "excluded" },
    { name: "SSO", type: "excluded" },
  ];

  const premiumFeatures: Feature[] = [
    { name: "Curriculum Planning", type: "included" },
    { name: "Compliance", type: "included" },
    { name: "Rostering & Timesheets", type: "included" },
    { name: "Attendances (Sign-In/Out)", type: "included" },
    { name: "CCS, Accounts & Billing", type: "included" },
    { name: "Reporting", type: "included" },
    { name: "Enrolment Forms", type: "included" },
    { name: "Email Campaigns", type: "included" },
    { name: "Multi-Site Management", type: "included" },
    { name: "API", type: "excluded" },
    { name: "SSO", type: "excluded" },
  ];

  const enterpriseFeatures: Feature[] = [
    { name: "Curriculum Planning", type: "included" },
    { name: "Compliance", type: "included" },
    { name: "Rostering & Timesheets", type: "included" },
    { name: "Attendances (Sign-In/Out)", type: "included" },
    { name: "CCS, Accounts & Billing", type: "included" },
    { name: "Reporting", type: "included" },
    { name: "Enrolment Forms", type: "included" },
    { name: "Email Campaigns", type: "included" },
    { name: "Multi-Site Management", type: "included" },
    { name: "API", type: "included" },
    { name: "SSO", type: "included" },
  ];

  return (
    <div id="price" className="min-h-screen flex flex-col bg-white pt-20">
      <main className="text-center px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-[var(--primary)] text-4xl font-bold mb-6">
          Pricing
        </h2>
        <p className="text-xl font-bold text-[var(--primary)] mb-12">
          All prices inclusive of GST
        </p>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lite */}
          <div className="border-4 border-[var(--yellow)] rounded-4xl px-6 py-8 md:p-14 shadow-sm hover:bg-[var(--yellow)]/20 transition">
            <div className="flex justify-center mb-2">
              <FaBaby className="text-[var(--yellow)] text-5xl" />
            </div>
            <h3 className="text-3xl text-[var(--yellow)] font-bold mb-2">
              LITE
            </h3>
            <p className="text-xl text-gray-600 font-bold mb-1">from $69/mth</p>
            <p className="text-sm text-gray-500 mb-6">BEST FOR PRESCHOOLS</p>
            <FeatureList features={liteFeatures} color="--yellow" />
            <button className="w-full bg-gray-600 text-white py-3 rounded-full font-medium">
              START FREE TRIAL
            </button>
          </div>

          {/* Premium */}
          <div className="border-4 border-[var(--primary)] rounded-4xl px-6 py-8 md:p-14 shadow-sm hover:bg-[var(--primary)]/20 transition">
            <div className="flex justify-center mb-2">
              <FaBabyCarriage className="text-[var(--primary)] text-5xl" />
            </div>
            <h3 className="text-3xl text-[var(--primary)] font-bold mb-2">
              PREMIUM
            </h3>
            <p className="text-xl text-gray-600 font-bold mb-1">from $89/mth</p>
            <p className="text-sm text-gray-500 mb-6">
              BEST FOR LDC & OOSH/OSHC
            </p>
            <FeatureList features={premiumFeatures} color="--primary" />
            <button className="w-full bg-[var(--primary)] text-white py-3 rounded-full font-medium">
              BOOK A DEMO
            </button>
          </div>

          {/* Enterpries */}
          <div className="border-4 border-[var(--pink)] rounded-4xl px-6 py-8 md:p-14 shadow-sm hover:bg-[var(--pink)]/20 transition">
            <div className="flex justify-center mb-2">
              <FaBuilding className="text-[var(--pink)] text-5xl" />
            </div>
            <h3 className="text-3xl text-[var(--pink)] font-bold mb-2">
              ENTERPRISE
            </h3>
            <p className="text-xl text-gray-600 font-bold mb-1">Contact Us</p>
            <p className="text-sm text-gray-500 mb-6">
              BEST FOR LARGE PROVIDERS
            </p>
            <FeatureList features={enterpriseFeatures} color="--pink" />
            <button className="w-full bg-[var(--pink)] text-white py-3 rounded-full font-medium">
              REQUEST A QUOTE
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
