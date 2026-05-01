import React from "react";
import { Radar } from "react-chartjs-2";

interface RadarChartProps {
  title: string;
  data: any;
  options?: any;
}

const RadarChart: React.FC<RadarChartProps> = ({ title, data, options }) => {
  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="h-[300px]">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default RadarChart;
