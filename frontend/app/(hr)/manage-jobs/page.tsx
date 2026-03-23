"use client";

import React, { useState } from "react";
import { 
  Search, Plus, ChevronDown, Users, Pencil, X, Trash2, ExternalLink, Briefcase, Check, AlertCircle
} from "lucide-react";
import Link from "next/link";

const INITIAL_JOBS_DATA = [
  { id: 1, title: "DevOps Engineer", manager: "John Davis", status: "Active", applicants: 4 },
  { id: 2, title: "Financial Analyst", manager: "John Davis", status: "Active", applicants: 3 },
  { id: 3, title: "Front-End Developer", manager: "John Davis", status: "Active", applicants: 0 },
  { id: 4, title: "Sales Manager", manager: "John Davis", status: "Active", applicants: 4 },
];

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState(INITIAL_JOBS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [expandedStatusDropdown, setExpandedStatusDropdown] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "status" | "applicants">("title");
  const [expandedSortDropdown, setExpandedSortDropdown] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    } else {
      return b.applicants - a.applicants;
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setExpandedStatusDropdown(false);
  };

  const handleSortChange = (field: "title" | "status" | "applicants") => {
    setSortBy(field);
    setExpandedSortDropdown(false);
  };

  const handleAddNewJob = () => {
    setMessage({ type: "success", text: "Redirect to job creation form (feature coming soon)" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditStart = (job: typeof INITIAL_JOBS_DATA[0]) => {
    setEditingId(job.id);
    setEditTitle(job.title);
  };

  const handleEditSave = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, title: editTitle } : job
    ));
    setEditingId(null);
    setMessage({ type: "success", text: `Job title updated successfully` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleCloseJob = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: job.status === "Closed" ? "Active" : "Closed" } : job
    ));
    const job = jobs.find(j => j.id === id);
    const newStatus = job?.status === "Closed" ? "Active" : "Closed";
    setMessage({ type: "success", text: `Job marked as ${newStatus}` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteJob = (id: number) => {
    const deletedJob = jobs.find(j => j.id === id);
    setJobs(jobs.filter(job => job.id !== id));
    setMessage({ type: "error", text: `"${deletedJob?.title}" has been deleted` });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-3 md:py-4 md:px-12 lg:px-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Jagir</span>
        </Link>
        <div className="text-sm font-semibold text-gray-600">Manage Jobs</div>
      </nav>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 ${
          message.type === "success" 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? (
            <Check className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Job Management</h1>
            <p className="text-base md:text-lg text-gray-600 mt-2">Manage your job postings and track applications</p>
          </div>
          <button 
            onClick={handleAddNewJob}
            className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap">
            <Plus className="h-5 w-5" />
            Add New Job
          </button>
        </div>

        <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-100/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative w-full md:w-auto">
              <button 
                onClick={() => setExpandedStatusDropdown(!expandedStatusDropdown)}
                className="w-full md:w-auto flex items-center justify-between gap-10 px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                {statusFilter}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expandedStatusDropdown ? "rotate-180" : ""}`} />
              </button>
              {expandedStatusDropdown && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                  {["All Status", "Active", "Closed"].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors ${
                        statusFilter === status
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gradient-to-r from-blue-50/50 to-violet-50/50 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-700">Showing <span className="text-gray-900 font-bold">{sortedJobs.length}</span> of <span className="text-gray-900 font-bold">{jobs.length}</span> jobs</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {sortedJobs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 font-semibold">No jobs found matching your criteria</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100/50 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">
                    <th className="px-8 py-5">
                      <button 
                        onClick={() => handleSortChange("title")}
                        className="flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
                        Job Title <ChevronDown className={`h-3 w-3 transition-transform ${sortBy === "title" ? "rotate-180" : ""}`} />
                      </button>
                    </th>
                    <th className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleSortChange("status")}
                        className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
                        Status <ChevronDown className={`h-3 w-3 transition-transform ${sortBy === "status" ? "rotate-180" : ""}`} />
                      </button>
                    </th>
                    <th className="px-8 py-5 text-center">
                      <button 
                        onClick={() => handleSortChange("applicants")}
                        className="flex items-center justify-center gap-1 cursor-pointer hover:text-gray-700 transition-colors">
                        Applicants <ChevronDown className={`h-3 w-3 transition-transform ${sortBy === "applicants" ? "rotate-180" : ""}`} />
                      </button>
                    </th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {sortedJobs.map((job) => (
                    <tr key={job.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div>
                          {editingId === job.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                            />
                          ) : (
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</p>
                          )}
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">{job.manager}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ring-1 transition-all ${
                          job.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:ring-emerald-300"
                            : "bg-red-50 text-red-700 ring-red-200 hover:ring-red-300"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg ring-1 ring-blue-200">
                          <Users className="h-4 w-4" />
                          {job.applicants}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === job.id ? (
                            <>
                              <button 
                                onClick={() => handleEditSave(job.id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Save">
                                <Check className="h-4.5 w-4.5" />
                              </button>
                              <button 
                                onClick={handleEditCancel}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="Cancel">
                                <X className="h-4.5 w-4.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleEditStart(job)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit">
                                <Pencil className="h-4.5 w-4.5" />
                              </button>
                              <button 
                                onClick={() => handleCloseJob(job.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                                  job.status === "Closed"
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-orange-600 hover:bg-orange-50"
                                }`}
                                title={job.status === "Closed" ? "Reopen" : "Close"}>
                                <X className="h-4 w-4" />
                                {job.status === "Closed" ? "Reopen" : "Close"}
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(job.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete">
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}