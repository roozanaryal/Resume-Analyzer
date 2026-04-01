import Link from "next/link";
import { Briefcase, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-[-10%] left-[-10%] h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl" />
      <div className="absolute top-[-5%] right-[-10%] h-[280px] sm:h-[400px] w-[280px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl" />

      {/* Signup Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">Jagir</span>
          </Link>
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">Create Account</h1>
          <p className="mt-1.5 text-gray-500 text-center text-sm sm:text-base">Join our community of professionals today</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xl shadow-blue-500/5">
          <form className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all active:scale-95 mt-2"
            >
              Sign Up
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.16-1.82 4.072-1.152 1.152-2.952 2.452-6.02 2.452-4.848 0-8.728-3.92-8.728-8.728s3.88-8.728 8.728-8.728c2.616 0 4.504 1.032 5.904 2.344l2.304-2.304C18.592 1.056 15.892 0 12.48 0 5.588 0 0 5.588 0 12.48s5.588 12.48 12.48 12.48c3.708 0 6.516-1.212 8.72-3.512 2.268-2.268 2.964-5.412 2.964-7.852 0-.748-.064-1.472-.18-2.188h-11.484z" fill="currentColor" />
              </svg>
              Google
            </button>
          </div>
        </div>

        <p className="mt-5 sm:mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
