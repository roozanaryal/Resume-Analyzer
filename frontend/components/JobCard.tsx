"use client";

import React from "react";
import { Briefcase, MapPin, Bookmark, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface Job {
  id: string | number;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  date: string;
  salary: string;
  logo: string;
  status?: string;
  skillsRequired?: string;
}

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSaveToggle: (id: string | number) => void;
  onApply?: (id: string | number) => void;
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
    <Link href={`/${job.id}`} className="block h-full group">
      <div
        className={`bg-white rounded-3xl border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all relative overflow-hidden h-full ${
          isListView
            ? "p-4 sm:p-5 flex flex-col md:flex-row md:items-center"
            : "p-6 flex flex-col"
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
            e.stopPropagation();
            onSaveToggle(job.id);
          }}
          className={`absolute ${isListView ? "top-4 right-4 sm:top-5 sm:right-5" : "top-6 right-6"} transition-colors cursor-pointer z-10 ${
            isSaved ? "text-blue-600" : "text-gray-300 hover:text-blue-500"
          }`}
          title={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark
            className="h-6 w-6"
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>

        {isListView ? (
          /* List View Inner Layout */
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 md:gap-6 pr-8 sm:pr-10 md:pr-12">
            {/* Left Section: Logo, Title, Company Name, Skills */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm p-2 group-hover:scale-105 transition-transform">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors truncate">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-tight mr-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.company}
                  </div>
                  {job.skillsRequired && (
                    <div className="flex flex-wrap items-center gap-1">
                      {job.skillsRequired
                        .split(/[,;\n]+/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50/80 text-blue-700 rounded-md text-[9px] font-bold border border-blue-100/50 truncate max-w-[80px]"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Section: Badges (Location, Type, Category) */}
            <div className="flex flex-wrap gap-2 items-center md:justify-center shrink-0">
              <span className="px-2.5 py-1 bg-slate-100 text-gray-600 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {job.type}
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {job.category}
              </span>
            </div>

            {/* Date Section */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">
              <Calendar className="h-4 w-4" />
              {showSavedDate ? "Saved on " : ""}
              {job.date}
            </div>

            {/* Right Section: Salary & Action button */}
            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 shrink-0 mt-2 md:mt-0">
              <div>
                <p className="text-lg sm:text-xl font-black text-blue-600 whitespace-nowrap">
                  {job.salary}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isApplied && onApply) onApply(job.id);
                }}
                disabled={isApplied}
                className={`px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  isApplied
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 active:scale-95 cursor-pointer"
                }`}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
          </div>
        ) : (
          /* Grid View Inner Layout */
          <>
            {/* Logo and Title Section */}
            <div className="flex gap-4 items-start mb-6">
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
            <div className="flex flex-wrap gap-2 mb-6">
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

            {/* Required Skills Pills */}
            {job.skillsRequired && (
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {job.skillsRequired
                  .split(/[,;\n]+/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-blue-50/80 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100/50 truncate max-w-[120px]"
                    >
                      {skill}
                    </span>
                  ))}
                {job.skillsRequired.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length > 3 && (
                  <span className="text-[10px] font-bold text-gray-400">
                    +{job.skillsRequired.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Date Section */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
              <Calendar className="h-4 w-4" />
              {showSavedDate ? "Saved on " : ""}
              {job.date}
            </div>

            {/* Separator for grid view */}
            <div className="h-px bg-gray-50 mb-6" />

            {/* Footer Section (Salary and Action) */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Salary
                </p>
                <p className="text-xl sm:text-2xl font-black text-blue-600">
                  {job.salary}
                </p>
              </div>
              <div className="flex items-center gap-3 transition-transform group-hover:translate-x-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest hidden group-hover:block transition-all animate-in fade-in slide-in-from-left-2">
                  View Details
                </span>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
