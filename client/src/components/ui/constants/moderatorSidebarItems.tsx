import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import { FiPlus, FiUsers, FiUser, FiBookOpen } from "react-icons/fi";
import type { SidebarItem } from "../sidebar/sidebar.types";

export const moderatorSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: HiOutlineViewGrid,
    path: "/moderator",
  },
  {
    id: "profile-settings",
    label: "Profile Settings",
    icon: FiUser,
    subItems: [
      {
        id: "view-profiles",
        label: "View Profiles",
        icon: FiUsers,
        path: "/moderator/profiles",
      },
      {
        id: "add-profile",
        label: "Add Profile",
        icon: FiPlus,
        path: "/moderator/profiles/add",
      },
    ],
  },
  {
    id: "user-settings",
    label: "User Settings",
    icon: HiOutlineUserGroup,
    subItems: [
      {
        id: "view-users",
        label: "View Users",
        icon: FiUsers,
        path: "/moderator/users",
      },
    ],
  },
  {
    id: "lesson-settings",
    label: "Lesson Settings",
    icon: HiOutlineAcademicCap,
    subItems: [
      {
        id: "view-lesson",
        label: "View Lesson",
        icon: FiBookOpen,
        path: "/moderator/lesson",
      },
      {
        id: "add-lesson",
        label: "Add Lesson",
        icon: FiPlus,
        path: "/moderator/lesson/add",
      },
    ],
  },
];
