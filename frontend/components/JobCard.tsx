"use client";

import React from "react";
import { Briefcase, MapPin, Bookmark, Calendar } from "lucide-react";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  date: string;
  salary: string;
  logo: string;
  status?: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSaveToggle: (id: number) => void;
  onApply?: (id: number) => void;
  isApplied?: boolean;
  showSavedDate?: boolean;
  view?: "grid" | "list";
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onSaveToggle,
  onApply,
  isApplied = false,
  showSavedDate = false,
  view = "grid",
}) => {
  const isListView = view === "list";

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden ${
        isListView
          ? "p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4 sm:gap-6"
          : "p-6 flex flex-col h-full"
      }`}
    >
      {/* Decorative background element for card */}
      {!isListView && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/30 blur-2xl -mr-12 -mt-12 rounded-full group-hover:bg-blue-100/40 transition-colors" />
      )}

      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onSaveToggle(job.id);
        }}
        className={`absolute ${isListView ? "top-4 right-4" : "top-6 right-6"} transition-colors cursor-pointer z-10 ${
          isSaved ? "text-blue-600" : "text-gray-300 hover:text-blue-500"
        }`}
        title={isSaved ? "Remove from saved" : "Save job"}
      >
        <Bookmark
          className="h-6 w-6"
          fill={isSaved ? "currentColor" : "none"}
        />
      </button>

      {/* Logo and Title Section */}
      <div
        className={`flex gap-4 items-start ${isListView ? "md:w-1/3" : "mb-6"}`}
      >
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm p-2 group-hover:scale-110 transition-transform">
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

      {/* Meta Info Section (Location, Type, Category) */}
      <div
        className={`flex flex-wrap gap-2 ${isListView ? "md:w-1/4" : "mb-6"}`}
      >
        <span className="px-3 py-1 bg-slate-100 text-gray-600 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
          <MapPin className="h-3 w-3" />
          {job.location}
        </span>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
          {job.type}
        </span>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
          {job.category}
        </span>
      </div>

      {/* Date Section */}
      <div
        className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider ${isListView ? "md:w-1/6" : "mb-6"}`}
      >
        <Calendar className="h-4 w-4" />
        {showSavedDate ? "Saved on " : ""}
        {job.date}
      </div>

      {/* Separator for grid view */}
      {!isListView && <div className="h-px bg-gray-50 mb-6" />}

      {/* Footer Section (Salary and Action) */}
      <div
        className={`flex items-center justify-between ${isListView ? "md:w-1/4 mt-auto md:mt-0" : "mt-auto"}`}
      >
        <div>
          {!isListView && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Salary
            </p>
          )}
          <p className="text-xl sm:text-2xl font-black text-blue-600">
            {job.salary}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!isApplied && onApply) onApply(job.id);
          }}
          disabled={isApplied}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
            isApplied
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 cursor-pointer"
          }`}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
