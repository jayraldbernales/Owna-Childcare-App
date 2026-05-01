import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineUserCircle,
  HiOutlineCog,
  HiOutlineUserAdd,
} from "react-icons/hi";
import { FiPlus, FiUsers, FiUser, FiBookOpen } from "react-icons/fi";
import type { SidebarItem } from "../sidebar/sidebar.types";

export const moderatorSidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: HiOutlineViewGrid,
    path: "/admin",
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
        path: "/admin/profiles",
      },
      {
        id: "add-profile",
        label: "Add Profile",
        icon: FiPlus,
        path: "/admin/profiles/add",
      },
    ],
  },
  {
    id: "student-settings",
    label: "Student Settings",
    icon: HiOutlineUserGroup,
    subItems: [
      {
        id: "view-student",
        label: "View Student",
        icon: FiUsers,
        path: "/admin/student",
      },
      {
        id: "add-student",
        label: "Add Student",
        icon: FiPlus,
        path: "/admin/student/add",
      },
    ],
  },
  {
    id: "quiz-settings",
    label: "Quiz Settings",
    icon: HiOutlineAcademicCap,
    subItems: [
      {
        id: "view-quiz",
        label: "View Quiz",
        icon: FiBookOpen,
        path: "/admin/quiz",
      },
      {
        id: "add-lesson",
        label: "Add Quiz",
        icon: FiPlus,
        path: "/admin/quiz/add",
      },
    ],
  },
  {
    id: "account-settings",
    label: "Account Settings",
    icon: HiOutlineCog,
    subItems: [
      {
        id: "view-account",
        label: "View Account",
        icon: HiOutlineUserCircle,
        path: "/admin/account",
      },
      {
        id: "add-account",
        label: "Add Account",
        icon: HiOutlineUserAdd,
        path: "/admin/account/add",
      },
    ],
  },
];
