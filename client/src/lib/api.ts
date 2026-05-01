import axiosInstance from "./axios";
import type { SignInForm, SignUpForm } from "../lib/formschema";

export const signUp = async (data: SignUpForm) => {
  return axiosInstance.post("/api/v1/auth/signup", data);
};

export const signIn = async (data: SignInForm) => {
  return axiosInstance.post("/api/v1/auth/login", data);
};

export const logout = async () => {
  return axiosInstance.post("/api/v1/auth/logout");
};

export const getMyProfile = () => {
  return axiosInstance.get("/api/v1/user/me");
};

export const updateProfile = (data: {
  firstname: string;
  lastname: string;
  email: string;
}) => {
  return axiosInstance.put("/api/v1/user/profile", data);
};

export const updatePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return axiosInstance.put("/api/v1/user/password", data);
};

export const linkChild = (linkCode: string) => {
  return axiosInstance.post("/api/children/link", { linkCode });
};
