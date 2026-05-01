import type { User } from "../lib/context";

export const getUserDisplayInfo = (user: User | null) => {
  const name = user?.firstname || "User";
  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";
  const initial = user?.firstname?.charAt(0).toUpperCase() || "U";

  return { name, role, initial };
};
