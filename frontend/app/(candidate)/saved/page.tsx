"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Bookmark,
  Calendar,
  ChevronDown,
  ArrowLeft,
  Search,
} from "lucide-react";
import Link from "next/link";

const SAVED_JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, USA",
    type: "Full-Time",
    category: "IT & Software",
    date: "5th Jul 2025",
    salary: "$60k/m",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TN&backgroundColor=0284c7",
  },
  {
    id: 4,
    title: "Sales Manager",
    company: "NeoHire Labs",
    location: "Remote",
    type: "Full-Time",
    category: "Sales",
    date: "3rd Jul 2025",
    salary: "$70k/m",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=NH&backgroundColor=2563eb",
  },
];

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState(SAVED_JOBS);

  const removeJob = (id: number) => {
    setSavedJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-3 md:py-4 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Jagir
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/find-jobs"
              className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="/saved"
              className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Saved Jobs
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Mary Johnson</p>
              <p className="text-xs font-semibold text-gray-400 leading-tight">
                Candidate
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden ring-2 ring-white shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mary"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:py-10 md:px-12 lg:px-24">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <Link
              href="/find-jobs"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 mb-2 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Jobs
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Saved Jobs
            </h1>
            <p className="text-gray-500 font-medium">
              Manage and track the jobs you've interested in
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-2 bg-blue-50 rounded-xl">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Total Saved
              </p>
              <p className="text-2xl font-black text-blue-700">
                {savedJobs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Jobs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.length > 0 ? (
            savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                {/* Decorative background element for card */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 blur-2xl -mr-12 -mt-12 rounded-full group-hover:bg-blue-100/40 transition-colors" />

                <button
                  onClick={() => removeJob(job.id)}
                  className="absolute top-6 right-6 text-blue-600 hover:text-red-500 transition-colors cursor-pointer z-10"
                  title="Remove from saved"
                >
                  <Bookmark className="h-6 w-6" fill="currentColor" />
                </button>

                <div className="flex gap-4 items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm p-2 group-hover:scale-110 transition-transform">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="h-full w-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-sm font-semibold text-gray-400 uppercase tracking-tight">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.company}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-slate-100 text-gray-600 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                    {job.type}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
                    {job.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
                  <Calendar className="h-4 w-4" />
                  Saved on {job.date}
                </div>

                <div className="h-px bg-gray-50 mb-6" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Salary
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                      {job.salary}
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 transition-all cursor-pointer">
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-dashed border-gray-200">
                <Bookmark className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No saved jobs yet
              </h3>
              <p className="text-gray-500 max-w-sm mb-8 font-medium">
                Jobs you save will appear here. Start exploring and find your
                next opportunity!
              </p>
              <Link
                href="/find-jobs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <Search className="h-5 w-5" />
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Recommendations Section (Optional Add-on for "Premium" feel) */}
        {savedJobs.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Recommended for You
            </h2>
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 blur-2xl -ml-24 -mb-24 rounded-full" />

              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold mb-4">
                    Get personalized job alerts
                  </h3>
                  <p className="text-blue-100 text-lg font-medium mb-8">
                    We'll notify you as soon as new jobs matching your saved
                    interests are posted.
                  </p>
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95">
                    Turn on Alerts
                  </button>
                </div>
                <div className="hidden md:flex justify-end">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl rotate-3 shadow-xl max-w-[240px]">
                    <div className="flex gap-3 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-white/20 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 w-2/3 bg-white/30 rounded-full animate-pulse" />
                        <div className="h-2 w-1/2 bg-white/20 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 w-full bg-white/20 rounded-xl animate-pulse" />
                      <div className="h-8 w-full bg-white/20 rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}