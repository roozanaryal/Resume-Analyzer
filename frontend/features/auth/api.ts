import { api } from "@/lib/axios";
import { AuthResponse, LoginInput } from "./types";

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get("/auth/me");
  return response.data.user;
};
