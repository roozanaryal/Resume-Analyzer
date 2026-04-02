import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

