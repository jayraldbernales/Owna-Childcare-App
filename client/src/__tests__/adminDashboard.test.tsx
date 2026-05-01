import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../lib/context";
import AdminDashboard from "../components/owna/Admin/adminDashboard";

jest.mock("../components/ui/navbar", () => () => <div>Mocked Navbar</div>);
jest.mock("../components/ui/sidebar", () => () => <div>Mocked Sidebar</div>);
jest.mock("../components/ui/charts/statCard", () => () => (
  <div>Mocked StatsCard</div>
));
jest.mock("../components/ui/charts/lineChart", () => () => (
  <div>Mocked LineChart</div>
));
jest.mock("../components/ui/charts/pieChart", () => () => (
  <div>Mocked PieChart</div>
));
jest.mock("../components/ui/modals/sendNotificationModal", () => () => (
  <div>Mocked Notification Modal</div>
));

describe("AdminDashboard", () => {
  it("renders without crashing", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <AdminDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
  });

  it("displays mocked dashboard components", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <AdminDashboard />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();
    expect(screen.getByText("Mocked Sidebar")).toBeInTheDocument();
    expect(screen.getAllByText("Mocked StatsCard")).toHaveLength(4);
    expect(screen.getByText("Mocked LineChart")).toBeInTheDocument();
    expect(screen.getByText("Mocked PieChart")).toBeInTheDocument();
    expect(screen.getByText("Mocked Notification Modal")).toBeInTheDocument();
  });
});
