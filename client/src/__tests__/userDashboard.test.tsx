import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../lib/context";
import UserDashboard from "../components/owna/User/userDashboard";

jest.mock("../components/ui/navbar", () => () => <div>Mocked Navbar</div>);
jest.mock("../components/ui/sidebar", () => () => <div>Mocked Sidebar</div>);
jest.mock("../components/ui/charts/statCard", () => () => (
  <div>Mocked StatsCard</div>
));
jest.mock("../components/ui/charts/barChart", () => () => (
  <div>Mocked BarChart</div>
));
jest.mock("../components/ui/charts/pieChart", () => () => (
  <div>Mocked PieChart</div>
));

describe("UserDashboard", () => {
  it("renders without crashing", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/user"]}>
          <UserDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
  });

  it("displays mocked child components", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/user"]}>
          <UserDashboard />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();
    expect(screen.getByText("Mocked Sidebar")).toBeInTheDocument();
    expect(screen.getAllByText("Mocked StatsCard").length).toBe(4);
    expect(screen.getByText("Mocked BarChart")).toBeInTheDocument();
    expect(screen.getByText("Mocked PieChart")).toBeInTheDocument();
  });
});
