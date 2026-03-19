"use client";

import React, { useState } from "react";
import { 
  Search, MapPin, Briefcase, Bookmark, Bell, ChevronDown, 
  LayoutGrid, List, Calendar, DollarSign, Filter, X 
} from "lucide-react";
import Link from "next/link";

const JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, USA",
    type: "Full-Time",
    category: "IT & Software",
    date: "5th Jul 2025",
    salary: "$60k/m",
    status: "Applied",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TN&backgroundColor=0284c7"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "BlueGrid Technologies",
    location: "Berlin, Germany",
    type: "Full-Time",
    category: "Design",
    date: "5th Jul 2025",
    salary: "$65k/m",
    status: "Applied",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=BG&backgroundColor=7c3aed"
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    company: "PixelForge Studios",
    location: "London, UK",
    type: "Remote",
    category: "Marketing",
    date: "4th Jul 2025",
    salary: "$55k/m",
    status: "Apply Now",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=PF&backgroundColor=db2777"
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
    status: "Apply Now",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=NH&backgroundColor=2563eb"
  }
];

export default function FindJobsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">JobPortal</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">Mary Johnson</p>
              <p className="text-xs font-semibold text-gray-400 leading-tight">Employer</p>
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

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12 lg:px-24">
        {/* Search Hero Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl -mr-16 -mt-16" />
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-gray-500 font-medium mb-8">Discover opportunities that match your passion</p>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Job title or keywords" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                defaultValue="front"
              />
            </div>
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all">
              Search Jobs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Filter Jobs</h2>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Clear All</button>
            </div>

            {/* Job Type */}
            <div className="space-y-4">
              <div className="flex items-center justify-between cursor-pointer group">
                <span className="font-bold text-gray-700">Job Type</span>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="space-y-3 pl-1 text-sm font-medium text-gray-500">
                {["Remote", "Full-Time", "Part-Time", "Contract", "Internship"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer hover:text-gray-900 transition-colors">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      defaultChecked={type === "Full-Time"}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Salary Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between cursor-pointer group">
                <span className="font-bold text-gray-700">Salary Range</span>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 tracking-wider">MIN SALARY</label>
                  <input type="text" placeholder="Min" className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 tracking-wider">MAX SALARY</label>
                  <input type="text" placeholder="Max" className="w-full px-3 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-8">
              <p className="font-semibold text-gray-500">Showing <span className="text-gray-900">10</span> jobs</p>
              
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                <button 
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Job Grid */}
            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {JOBS.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                  <button className="absolute top-6 right-6 text-gray-300 hover:text-blue-500 transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>

                  <div className="flex gap-4 items-start mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner p-2.5">
                      <img src={job.logo} alt={job.company} className="h-full w-full object-contain rounded-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 md:text-lg group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-gray-400 uppercase tracking-tight">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-slate-100 text-gray-500 rounded-full text-xs font-bold flex items-center gap-1.5">
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
                    <Calendar className="h-3.5 w-3.5" />
                    {job.date}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-2xl font-bold text-blue-600">{job.salary}</p>
                    <button className={`px-6 py-2 rounded-xl border font-bold text-sm transition-all ${
                      job.status === 'Applied' 
                      ? 'bg-gray-100 border-gray-100 text-gray-500 cursor-default' 
                      : 'bg-white border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg shadow-sm active:scale-95'
                    }`}>
                      {job.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
