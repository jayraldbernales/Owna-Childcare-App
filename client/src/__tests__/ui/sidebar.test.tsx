import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import "@testing-library/jest-dom";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SidebarItem[];
  path?: string;
}

jest.mock("react-icons/fi", () => ({
  FiChevronDown: () => <span data-testid="chevron-down" />,
  FiChevronRight: () => <span data-testid="chevron-right" />,
  FiX: () => <span data-testid="close-icon" />,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockNavigate = jest.fn();
const mockUseLocation = useLocation as jest.Mock;
const mockUseNavigate = useNavigate as jest.Mock;

const mockItems: SidebarItem[] = [
  {
    id: "1",
    label: "Dashboard",
    icon: () => <span data-testid="dashboard-icon" />,
    path: "/dashboard",
  },
  {
    id: "2",
    label: "Products",
    icon: () => <span data-testid="products-icon" />,
    subItems: [
      {
        id: "2-1",
        label: "All Products",
        icon: () => <span data-testid="all-products-icon" />,
        path: "/products",
      },
    ],
  },
  {
    id: "3",
    label: "User Settings",
    icon: () => <span data-testid="settings-icon" />,
    path: "/settings",
  },
];

describe("Sidebar Component", () => {
  beforeEach(() => {
    mockUseLocation.mockReturnValue({ pathname: "/" });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders closed state correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={false}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("complementary")).toHaveClass("-translate-x-full");
  });

  it("renders open state correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("complementary")).toHaveClass("translate-x-0");
    expect(screen.getByText("Test Logo")).toBeInTheDocument();
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={mockOnClose}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("close-icon"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders all top-level items", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("User Settings")).toBeInTheDocument();
  });

  it("expands/collapses items with sub-items", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
    expect(screen.queryByText("All Products")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Products"));
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
    expect(screen.getByText("All Products")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Products"));
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
    expect(screen.queryByText("All Products")).not.toBeInTheDocument();
  });

  it("navigates when item is clicked", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("highlights active route", () => {
    mockUseLocation.mockReturnValue({ pathname: "/dashboard" });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    const dashboardButton = screen.getByText("Dashboard").closest("button");
    expect(dashboardButton).toHaveClass("bg-[var(--primary)]");
  });

  it("auto-expands items with active sub-items", () => {
    mockUseLocation.mockReturnValue({ pathname: "/products" });

    render(
      <MemoryRouter initialEntries={["/products"]}>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
    expect(screen.getByText("All Products")).toBeInTheDocument();
  });

  it("groups settings items separately", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders default footer when none provided", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(`© ${new Date().getFullYear()} OWNA`)
    ).toBeInTheDocument();
  });

  it("renders custom footer when provided", () => {
    render(
      <MemoryRouter>
        <Sidebar
          logo={<div>Test Logo</div>}
          items={mockItems}
          isOpen={true}
          onClose={jest.fn()}
          footer={<div>Custom Footer</div>}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Custom Footer")).toBeInTheDocument();
  });
});
