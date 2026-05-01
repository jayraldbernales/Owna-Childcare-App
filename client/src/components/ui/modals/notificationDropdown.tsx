import React from "react";
import { IoNotifications, IoTime } from "react-icons/io5";

interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  notifDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  notifDropdownRef,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasUnread = unreadCount > 0;

  return (
    <div
      ref={notifDropdownRef}
      className="absolute right-16 top-12 w-82 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden backdrop-blur-sm"
      style={{
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="sticky top-0 px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                hasUnread ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <IoNotifications
                className={`w-5 h-5 ${
                  hasUnread ? "text-blue-600" : "text-gray-500"
                }`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
              {hasUnread && (
                <p className="text-sm text-blue-600 font-medium">
                  {unreadCount} unread{" "}
                  {unreadCount === 1 ? "notification" : "notifications"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoNotifications className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No notifications yet
            </h4>
            <p className="text-sm text-gray-500 max-w-xs">
              When you get notifications, they'll appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`group px-6 py-4 hover:bg-gray-50 transition-colors duration-150 relative ${
                  !notif.read ? "bg-blue-50/50" : "bg-white"
                }`}
              >
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                )}

                <div className="flex items-start gap-3 pl-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm break-words whitespace-normal ${
                        !notif.read
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {notif?.message || "New notification"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <IoTime className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>
                      {!notif.read && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
