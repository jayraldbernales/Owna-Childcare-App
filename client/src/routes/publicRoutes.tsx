import { lazy } from "react";
import { Route } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const SignIn = lazy(() => import("../pages/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));

const publicRoutes = [
  <Route path="/" element={<LandingPage />} />,
  <Route path="/signin" element={<SignIn />} />,
  <Route path="/signup" element={<SignUp />} />,
  <Route path="/unauthorized" element={<Unauthorized />} />,
  <Route path="*" element={<LandingPage />} />,
];

export default publicRoutes;
