"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "@/features/auth/types";
import { useLogin } from "@/features/auth/hooks";
import Link from "next/link";
import { Briefcase, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 text-zinc-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl transition-all hover:shadow-2xl  border border-zinc-200 ">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-500 ">
            Please enter your details to sign in
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-4 sm:p-5 rounded-3xl shadow-xl shadow-blue-500/5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2.5 sm:space-y-3"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 "
              >
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 "
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 "
                >
                  Forgot password?
                </Link>
              </div>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all sm:text-sm"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

          {(error as any) && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 ">
              <p className="text-sm text-red-600 ">
                {(error as any).response?.data?.message ||
                  "Something went wrong. Please try again."}
              </p>
            </div>
          )}

            <button
              type="submit"
              disabled={isPending}
              className="group w-full flex items-center justify-center gap-2 py-2 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        <p className="mt-8 text-center text-sm text-zinc-600 ">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
