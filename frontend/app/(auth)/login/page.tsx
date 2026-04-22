"use client";

import Link from "next/link";
import { Briefcase, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "@/features/auth/types";
import { useLogin } from "@/features/auth/hooks";

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
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center py-2 sm:py-4 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute bottom-[-20%] left-[-20%] h-50 sm:h-75 w-50 sm:w-75 rounded-full bg-blue-50/50 blur-3xl" />
      <div className="absolute top-[-10%] right-[-20%] h-45 sm:h-70 w-45 sm:w-70 rounded-full bg-violet-50/50 blur-3xl" />

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-2 sm:mb-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              Jagir
            </span>
          </Link>
          <h1 className="mt-1 sm:mt-2 text-lg sm:text-xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-0.5 text-gray-500 text-center text-xs">
            Sign in to continue to your account
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-4 sm:p-5 rounded-3xl shadow-xl shadow-blue-500/5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2.5 sm:space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-1.5 rounded-lg bg-red-50 border border-red-100">
                <p className="text-xs text-red-600">
                  {(error as any).response?.data?.message ||
                    "Login failed. Please try again."}
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

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Or continue
            </span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.16-1.82 4.072-1.152 1.152-2.952 2.452-6.02 2.452-4.848 0-8.728-3.92-8.728-8.728s3.88-8.728 8.728-8.728c2.616 0 4.504 1.032 5.904 2.344l2.304-2.304C18.592 1.056 15.892 0 12.48 0 5.588 0 0 5.588 0 12.48s5.588 12.48 12.48 12.48c3.708 0 6.516-1.212 8.72-3.512 2.268-2.268 2.964-5.412 2.964-7.852 0-.748-.064-1.472-.18-2.188h-11.484z"
                  fill="currentColor"
                />
              </svg>
              Google
            </button>
          </div>
        </div>

        <p className="mt-2.5 text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

