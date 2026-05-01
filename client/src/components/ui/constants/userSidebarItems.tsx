import { FiUsers, FiUser } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import type { SidebarItem } from "../sidebar/sidebar.types";

export const userSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/user",
  },
  {
    id: "children",
    label: "Children",
    icon: MdOutlineDashboard,
    path: "/user/children",
  },
  {
    id: "profile-settings",
    label: "Profile Settings",
    icon: FiUser,
    subItems: [
      {
        id: "view-profiles",
        label: "View Profile",
        icon: FiUsers,
        path: "/user/profile",
      },
    ],
  },
];
