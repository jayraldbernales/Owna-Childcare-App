import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo-login.png";

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-sm space-y-6 p-6 rounded text-center">
        <img
          src={logo}
          alt="OWNA Logo"
          className="mx-auto w-45"
          loading="lazy"
        />

        <div>
          <h2 className="text-2xl text-gray-600 mt-4">Unauthorized Access</h2>
          <p className="text-gray-600 text-lg">
            You don't have permission to this page
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>Error 401: Please sign in to access this resource</p>
          </div>
        </div>

        <div className="text-sm text-blue-500 mt-3">
          <Link to="/" className="hover:underline">
            OWNA Homepage
          </Link>
          <span> | </span>
          <Link to="/signup" className="hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>© 2025 OWNA Corp Pty Ltd - ACN 613387474</p>
          <p>Version 1.22.202409051221</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
