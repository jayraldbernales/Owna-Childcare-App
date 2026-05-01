import React from "react";
import { FiSearch, FiChevronDown, FiBell, FiMenu } from "react-icons/fi";
import { getUserDisplayInfo } from "../../utils/userHelper";
import NotificationDropdown from "./modals/notificationDropdown";
import { useNavbarLogic } from "../../hooks/useNavbar";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
  showSearch?: boolean;
  onAdminNotifClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  title = "Dashboard",
  showSearch = true,
  onAdminNotifClick,
}) => {
  const {
    user,
    dropdownRef,
    notifDropdownRef,
    dropdownOpen,
    setDropdownOpen,
    showLogoutConfirm,
    setShowLogoutConfirm,
    notifications,
    unreadCount,
    showNotifDropdown,
    setShowNotifDropdown,
    handleLogout,
  } = useNavbarLogic();

  const { name, role, initial } = getUserDisplayInfo(user);

  return (
    <header className="px-6 py-4 flex items-center shadow-sm justify-between">
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="text-gray-600 lg:hidden">
          <FiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center space-x-6">
        {showSearch && (
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>
        )}

        <button
          className="relative p-2 hover:bg-gray-100 rounded-full"
          onClick={() => {
            if (role === "Admin" && onAdminNotifClick) {
              onAdminNotifClick();
            } else {
              setShowNotifDropdown((prev) => !prev);
            }
          }}
        >
          <FiBell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
        {showNotifDropdown && (
          <NotificationDropdown
            notifications={notifications}
            notifDropdownRef={notifDropdownRef}
          />
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="group flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-100 transition-all focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">
                {initial}
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-medium text-gray-800 text-sm">{name}</span>
              <span className="text-xs text-gray-500">{role}</span>
            </div>

            <FiChevronDown className="text-gray-500 group-hover:rotate-180 transition-transform duration-200 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-sm">
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
