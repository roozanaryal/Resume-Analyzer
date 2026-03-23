import { Search, Briefcase, Users, Building2, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl" />
      <div className="absolute right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Jagir</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/jobs" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Find Jobs
          </Link>
          <Link href="/employers" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            For Employers
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 sm:px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 md:py-20 lg:py-24 text-center md:px-12 lg:px-24">
        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 lg:text-7xl">
          Find Your Dream Job or{" "}
          <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Perfect Hire
          </span>
        </h1>
        <p className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-gray-600">
          Connect talented professionals with innovative companies. Your next career move or perfect candidate is just one click away.
        </p>

        <div className="mt-10 sm:mt-12 md:mt-14 flex flex-col gap-3 sm:gap-4 sm:flex-row">
          <Link href="/find-jobs" className="group flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-violet-600 px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95">
            <Search className="h-5 w-5" />
            Find Jobs
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/(hr)/manage-jobs" className="flex items-center justify-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all active:scale-95">
            Post a Job
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-20 md:mt-28 lg:mt-32 w-full grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 border-t border-gray-200 pt-16 md:pt-20 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Users className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">2.4M+</p>
              <p className="mt-1 text-sm font-medium text-gray-600">Active Users</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Building2 className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">50K+</p>
              <p className="mt-1 text-sm font-medium text-gray-600">Companies</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <TrendingUp className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">150K+</p>
              <p className="mt-1 text-sm font-medium text-gray-600">Jobs Posted</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
