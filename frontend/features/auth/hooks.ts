import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authApi from "./api";
import { LoginInput, RegisterInput } from "./types";
import { useRouter } from "next/navigation";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      router.push("/");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      router.push("/login");
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      router.push("/");
    },
  });
};
