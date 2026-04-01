"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Bookmark } from "lucide-react";
import Link from "next/link";
import JobCard from "@/components/JobCard";

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
    <>
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
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSaveToggle={() => removeJob(job.id)}
              showSavedDate={true}
            />
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
              Jobs you save will appear here. Start exploring and find your next
              opportunity!
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
    </>
  );
}
