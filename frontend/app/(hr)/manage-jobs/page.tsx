"use client";

import React from "react";
import { 
  Search, Plus, ChevronDown, Users, Pencil, X, Trash2, ExternalLink 
} from "lucide-react";

const JOBS_DATA = [
  { id: 1, title: "DevOps Engineer", manager: "John Davis", status: "Active", applicants: 4 },
  { id: 2, title: "Financial Analyst", manager: "John Davis", status: "Active", applicants: 3 },
  { id: 3, title: "Front-End Developer", manager: "John Davis", status: "Active", applicants: 0 },
  { id: 4, title: "Sales Manager", manager: "John Davis", status: "Active", applicants: 4 },
];

export default function ManageJobsPage() {
  return (
    <div className="p-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Job Management</h1>
          <p className="text-sm font-semibold text-gray-400 mt-1">Manage your job postings and track applications</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95">
          <Plus className="h-5 w-5" />
          Add New Job
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            />
          </div>
          <button className="w-full md:w-auto flex items-center justify-between gap-10 px-5 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            All Status
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-500">Showing <span className="text-gray-900">4</span> of <span className="text-gray-900">4</span> jobs</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Job Title <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-8 py-5 text-center">
                  <div className="flex items-center justify-center gap-1 cursor-pointer">
                    Status <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-8 py-5 text-center">
                  <div className="flex items-center justify-center gap-1 cursor-pointer">
                    Applicants <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {JOBS_DATA.map((job) => (
                <tr key={job.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</p>
                      <p className="text-xs font-semibold text-gray-400 mt-0.5">{job.manager}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold ring-1 ring-emerald-100">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg ring-1 ring-blue-100">
                      <Users className="h-4 w-4" />
                      {job.applicants}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                        <Pencil className="h-4.5 w-4.5" />
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-xs font-bold" title="Close">
                        <X className="h-4 w-4" />
                        Close
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}