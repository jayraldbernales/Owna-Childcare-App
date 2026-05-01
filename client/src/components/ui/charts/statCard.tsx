import React from "react";
import type { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string;
  icon: IconType;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
  className = "",
}) => {
  return (
    <article
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 text-gray-800 hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </article>
  );
};

export default StatsCard;
