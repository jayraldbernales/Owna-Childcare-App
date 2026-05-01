import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import "@testing-library/jest-dom";

const MockComponent = () => <div>Mock Component</div>;
const UnauthorizedPage = () => <div>Unauthorized Page</div>;

jest.mock("../components/LoadingSpinner", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when user role is allowed", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole="admin">
                <MockComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Component")).toBeInTheDocument();
  });

  it("redirects to unauthorized when user role is not allowed", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole="user">
                <MockComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Unauthorized Page")).toBeInTheDocument();
  });

  it("redirects to custom path when provided and user role is not allowed", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                userRole="user"
                redirectPath="/custom-unauthorized"
              >
                <MockComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-unauthorized"
            element={<div>Custom Unauthorized Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Custom Unauthorized Page")).toBeInTheDocument();
  });

  it("redirects when user role is null", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole={null}>
                <MockComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Unauthorized Page")).toBeInTheDocument();
  });

  it("shows loading spinner during suspense", async () => {
    const LazyComponent = React.lazy(
      () =>
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => resolve({ default: MockComponent }), 100);
        })
    );

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={["admin"]} userRole="admin">
                <LazyComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });
});
