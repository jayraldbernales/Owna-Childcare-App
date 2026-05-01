import React from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface BarChartProps {
  title: string;
  data: ChartData<"bar">;
  options?: ChartOptions<"bar">;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, options }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="h-80">
        <Bar key="bar-attendance" data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
