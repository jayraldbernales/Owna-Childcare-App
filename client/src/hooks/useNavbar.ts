import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../lib/socket";
import { logout } from "../lib/api";
import { AuthStorage } from "../utils/authStorage";
import { useAuth } from "../lib/context";

interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export const useNavbarLogic = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      AuthStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (showNotifDropdown) {
      setUnreadCount(0);

      fetch(
        `http://localhost:8181/api/v1/notifications/mark-read/${user?.id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      ).catch((err) =>
        console.error("Failed to mark notifications as read", err)
      );

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    }
  }, [showNotifDropdown]);

  useEffect(() => {
    if (user?.id) {
      socket.emit("joinRoom", `user_${user.id}`);

      fetch(`http://localhost:8181/api/v1/notifications/${user.id}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Bad response");
          return res.json();
        })
        .then((data) => {
          setNotifications(data.notifications || []);
          const unread =
            data.notifications?.filter((n: Notification) => !n.read).length ||
            0;

          setUnreadCount(unread);
        })
        .catch((err) => console.error("Failed to fetch notifications", err));

      socket.on("newNotification", (data: Notification) => {
        setNotifications((prev: Notification[]) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [user?.id]);

  return {
    user,
    dropdownRef,
    notifDropdownRef,
    dropdownOpen,
    setDropdownOpen,
    showLogoutConfirm,
    setShowLogoutConfirm,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    showNotifDropdown,
    setShowNotifDropdown,
    handleLogout,
  };
};
