import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../../../assets/img/logo-login.png";

import Navbar from "../../ui/navbar";
import Sidebar from "../../ui/sidebar";
import StatsCard from "../../ui/charts/statCard";
import LineChart from "../../ui/charts/lineChart";
import PieChart from "../../ui/charts/pieChart";
import { moderatorSidebarItems } from "../../ui/constants/adminSidebarItems";
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import SendNotificationModal from "../../ui/modals/sendNotificationModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

const statsCards = [
  {
    title: "Total Users",
    value: "352",
    icon: HiOutlineUserGroup,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    title: "Total Children",
    value: "128",
    icon: HiOutlineUserGroup,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    title: "Total Staff",
    value: "36",
    icon: HiOutlineAcademicCap,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  {
    title: "Total Centres",
    value: "4",
    icon: HiOutlineOfficeBuilding,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
  },
];

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Registrations",
        data: [40, 55, 70, 65, 90, 80],
        borderColor: "#27a689",
        backgroundColor: "rgba(39, 166, 137, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ["Parents", "Children", "Educators"],
    datasets: [
      {
        data: [120, 165, 22],
        backgroundColor: ["#27a689", "#e74b7c", "#f6ab5e"],
        hoverBackgroundColor: [
          "rgba(39, 166, 137, 0.5)",
          "rgba(231, 75, 124, 0.5)",
          "rgba(246, 171, 94, 0.5)",
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
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onAdminNotifClick={() => setShowNotificationModal(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {location.pathname === "/admin" && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, idx) => (
                  <StatsCard key={idx} {...card} />
                ))}
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LineChart
                    title="Monthly User Registrations"
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { position: "top" } },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 10,
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

          <SendNotificationModal
            isOpen={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
          />

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
