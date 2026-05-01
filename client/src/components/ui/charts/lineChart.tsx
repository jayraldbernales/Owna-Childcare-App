import React from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface LineChartProps {
  title: string;
  data: ChartData<"line">;
  options?: ChartOptions<"line">;
}

const LineChart: React.FC<LineChartProps> = ({ title, data, options }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
