import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../../assets/img/logo-login.png";
import Navbar from "../../ui/navbar";
import Sidebar from "../../ui/sidebar";
import StatsCard from "../../ui/charts/statCard";
import BarChart from "../../ui/charts/barChart";
import PieChart from "../../ui/charts/pieChart";
import { userSidebarItems } from "../../ui/constants/userSidebarItems";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineCalendar,
  HiOutlineChatAlt,
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
    title: "My Children",
    value: "1",
    description: "Enrolled",
    icon: HiOutlineUserGroup,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    title: "Weekly Attendance",
    value: "95%",
    description: "This week",
    icon: HiOutlineClipboardCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
  {
    title: "Upcoming Activities",
    value: "3",
    description: "Next 7 days",
    icon: HiOutlineCalendar,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    title: "New Messages",
    value: "2",
    description: "From staff",
    icon: HiOutlineChatAlt,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];

const UserDashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const barChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Present",
        data: [34, 36, 33, 38, 37],
        backgroundColor: "#27a689",
      },
      {
        label: "Absent",
        data: [4, 2, 5, 1, 2],
        backgroundColor: "#e74b7c",
      },
    ],
  };

  const pieChartData = {
    labels: ["Academic", "Extracurricular", "Free Time "],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: ["#27a689", "#e74b7c", "#f6ab5e"],
        hoverBackgroundColor: [
          "rgba(39, 166, 137, 0.5)",
          "rgba(231, 75, 124, 0.56)",
          "rgba(246, 171, 94, 0.56)",
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      <Sidebar
        logo={<img src={logo} alt="OWNA Logo" className="mx-auto mt-2 h-30" />}
        items={userSidebarItems}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-y-auto md:p-8">
          {location.pathname === "/user" && (
            <>
              <section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                {statsCards.map((card, idx) => (
                  <StatsCard key={idx} {...card} />
                ))}
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <BarChart
                    title="Attendance Breakdown"
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1 },
                        },
                      },
                    }}
                  />
                </div>

                <PieChart
                  title="Weekly Activity Distribution"
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

export default UserDashboard;
