import { api } from "@/lib/axios";
import { AuthResponse, LoginInput, RegisterInput, User } from "./types";

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.get("/auth/logout");
};

export const getMe = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put("/auth/profile", data);
  return response.data.user;
};
