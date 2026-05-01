import React from "react";
import { Pie } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface PieChartProps {
  title: string;
  data: ChartData<"pie">;
  options?: ChartOptions<"pie">;
}

const PieChart: React.FC<PieChartProps> = ({ title, data, options }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
