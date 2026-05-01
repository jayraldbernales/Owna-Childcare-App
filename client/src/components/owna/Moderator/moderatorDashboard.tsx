import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../../assets/img/logo-login.png";

import Navbar from "../../ui/navbar";
import Sidebar from "../../ui/sidebar";
import StatsCard from "../../ui/charts/statCard";
import BarChart from "../../ui/charts/barChart";
import PieChart from "../../ui/charts/pieChart";
import { moderatorSidebarItems } from "../../ui/constants/moderatorSidebarItems";
import {
  HiOutlineUserGroup,
  HiOutlineChatAlt,
  HiOutlineClipboardCheck,
  HiOutlineClipboardList,
} from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const statsCards = [
  {
    title: "My Class",
    value: "18",
    description: "Children assigned",
    icon: HiOutlineUserGroup,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    title: "Attendance Today",
    value: "16/18",
    description: "Present children",
    icon: HiOutlineClipboardCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
  {
    title: "Tasks Due",
    value: "4",
    description: "To complete",
    icon: HiOutlineClipboardList,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
  },
  {
    title: "Parent Messages",
    value: "5",
    description: "Awaiting reply",
    icon: HiOutlineChatAlt,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];

const ModeratorDashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const barChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Present",
        data: [28, 30, 27, 33, 31],
        backgroundColor: "#27a689",
      },
      {
        label: "Absent",
        data: [5, 3, 6, 0, 2],
        backgroundColor: "#e74b7c",
      },
    ],
  };

  const pieChartData = {
    labels: ["Boys", "Girls", "Others"],
    datasets: [
      {
        data: [18, 13, 2],
        backgroundColor: ["#27a689", "#f6ab5e", "#e74b7c"],
        hoverBackgroundColor: [
          "rgba(39, 166, 137, 0.5)",
          "rgba(246, 171, 94, 0.56)",
          "rgba(231, 75, 124, 0.56)",
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar
        logo={<img src={logo} alt="OWNA Logo" className="h-30 mx-auto mt-2" />}
        items={moderatorSidebarItems}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {location.pathname === "/moderator" && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, idx) => (
                  <StatsCard key={idx} {...card} />
                ))}
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <BarChart
                    title="Daily Attendance Summary"
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </div>

                <PieChart
                  title="Attendance Breakdown"
                  data={pieChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </section>
            </>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
