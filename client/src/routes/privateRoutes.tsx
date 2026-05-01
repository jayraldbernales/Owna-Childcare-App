import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const ModeratorPanel = lazy(() => import("../pages/ModeratorDashboard"));
const UserDashboard = lazy(() => import("../pages/UserDashboard"));

const UserSettingsPage = lazy(
  () => import("../components/owna/User/UserSettingsPage")
);
const UserChildrenPage = lazy(
  () => import("../components/owna/User/UserChildrenPage")
);

const ModeratorUserPage = lazy(
  () => import("../components/owna/Moderator/ModeratorUserPage")
);
const ModeratorLesson = lazy(
  () => import("../components/owna/Moderator/ModeratorLesson")
);
const ModeratorLessonAdd = lazy(
  () => import("../components/owna/Moderator/ModeratorLessonAdd")
);
const ModeratorProfilePage = lazy(
  () => import("../components/owna/Moderator/ModeratorProfilePage")
);
const ModeratorProfileAdd = lazy(
  () => import("../components/owna/Moderator/ModeratorProfileAdd")
);

const AdminQuiz = lazy(() => import("../components/owna/Admin/AdminQuiz"));
const AdminQuizAdd = lazy(
  () => import("../components/owna/Admin/AdminQuizAdd")
);
const AdminStudentAdd = lazy(
  () => import("../components/owna/Admin/AdminStudentAdd")
);
const AdminStudentPage = lazy(
  () => import("../components/owna/Admin/AdminStudentPage")
);
const AdminProfileAdd = lazy(
  () => import("../components/owna/Admin/AdminProfileAdd")
);
const AdminProfilePage = lazy(
  () => import("../components/owna/Admin/AdminProfilePage")
);
const AdminAccount = lazy(
  () => import("../components/owna/Admin/AdminAccount")
);
const AdminAccountAdd = lazy(
  () => import("../components/owna/Admin/AdminAccountAdd")
);

AdminAccountAdd;

const PrivateRoutes = (role: string | null) => {
  const routeData = [
    {
      path: "/admin",
      element: <AdminDashboard />,
      roles: ["admin"],
      children: [
        { path: "profiles", element: <AdminProfilePage /> },
        { path: "profiles/add", element: <AdminProfileAdd /> },
        { path: "student", element: <AdminStudentPage /> },
        { path: "student/add", element: <AdminStudentAdd /> },
        { path: "quiz", element: <AdminQuiz /> },
        { path: "quiz/add", element: <AdminQuizAdd /> },
        { path: "account", element: <AdminAccount /> },
        { path: "account/add", element: <AdminAccountAdd /> },
      ],
    },
    {
      path: "/moderator",
      element: <ModeratorPanel />,
      roles: ["moderator"],
      children: [
        { path: "profiles", element: <ModeratorProfilePage /> },
        { path: "profiles/add", element: <ModeratorProfileAdd /> },
        { path: "users", element: <ModeratorUserPage /> },
        { path: "lesson", element: <ModeratorLesson /> },
        { path: "lesson/add", element: <ModeratorLessonAdd /> },
      ],
    },
    {
      path: "/user",
      element: <UserDashboard />,
      roles: ["user"],
      children: [
        { path: "profile", element: <UserSettingsPage /> },
        { path: "children", element: <UserChildrenPage /> },
      ],
    },
  ];

  return routeData.flatMap(({ path, element, roles, children }) => {
    const parent = (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute allowedRoles={roles} userRole={role}>
            {element}
          </ProtectedRoute>
        }
      >
        {children &&
          children.map((child) => (
            <Route
              key={`${path}/${child.path}`}
              path={child.path}
              element={child.element}
            />
          ))}
      </Route>
    );

    return parent;
  });
};

export default PrivateRoutes;
