import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
  userRole: string | null;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<Props> = ({
  children,
  allowedRoles,
  userRole,
  redirectPath = "/unauthorized",
}) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default ProtectedRoute;
