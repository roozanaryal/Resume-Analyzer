"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Filter, Download, FileText, CheckCircle, XCircle, Clock, ChevronDown, MoreHorizontal, Mail, MapPin, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data
const MOCK_APPLICANTS = [
  { id: 1, name: "Alice Smith", role: "Frontend Developer", location: "San Francisco, CA", email: "alice@example.com", appliedDate: "2 days ago", status: "Under Review", matchScore: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: 2, name: "Bob Jones", role: "Full Stack Engineer", location: "New York, NY", email: "bob@example.com", appliedDate: "3 days ago", status: "Shortlisted", matchScore: 85, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: 3, name: "Charlie Davis", role: "UI/UX Designer", location: "Austin, TX", email: "charlie@example.com", appliedDate: "5 days ago", status: "Rejected", matchScore: 45, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
  { id: 4, name: "Diana Prince", role: "Software Engineer", location: "Seattle, WA", email: "diana@example.com", appliedDate: "1 week ago", status: "Under Review", matchScore: 78, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana" },
];

export default function ApplicantsPage() {
  const params = useParams();
  const [mounted, setMounted] = React.useState(false);
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applicants.length,
    underReview: applicants.filter(a => a.status === "Under Review").length,
    shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
    rejected: applicants.filter(a => a.status === "Rejected").length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Shortlisted": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "Rejected": return "bg-red-50 text-red-700 ring-red-200";
      default: return "bg-blue-50 text-blue-700 ring-blue-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-87.5 sm:h-125 w-87.5 sm:w-125 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-75 sm:h-100 w-75 sm:w-100 rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-3 md:py-4 md:px-12 lg:px-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">Jagir</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/manage-jobs" className="text-sm font-semibold text-gray-400 hover:text-blue-600 transition-colors">
            Manage Jobs
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-600">Applicants</span>
        </div>
      </nav>

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/manage-jobs" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mb-4 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Job Applicants</h1>
            <p className="text-base md:text-lg text-gray-600 mt-2">Review and manage applications for Job ID: {mounted ? (params.id as string) : "..."}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all">
              <Download className="h-5 w-5" />
              Export
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applicants", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50/80" },
            { label: "Under Review", value: stats.underReview, icon: Clock, color: "text-amber-600", bg: "bg-amber-50/80" },
            { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50/80" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600", bg: "bg-red-50/80" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/98 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-xl shadow-blue-500/5 flex items-center gap-5">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Container */}
        <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
          {/* Search & Filter Bar */}
          <div className="p-6 border-b border-gray-100/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search applicants by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto" style={{ scrollbarWidth: 'none' }}>
              {["All", "Under Review", "Shortlisted", "Rejected"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    statusFilter === status 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-linear-to-r from-blue-50/50 to-violet-50/50 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-700">Showing <span className="text-gray-900 font-bold">{filteredApplicants.length}</span> of <span className="text-gray-900 font-bold">{applicants.length}</span> applicants</p>
          </div>

          {/* Applicants Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50/30">
            {filteredApplicants.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4 items-center">
                    <div className="relative h-14 w-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                      <img src={app.avatar} alt={app.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-blue-600 transition-colors">{app.name}</h3>
                      <p className="text-sm font-semibold text-gray-500">{app.role}</p>
                    </div>
                  </div>
                  <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6 flex-1 bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{app.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{app.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    Applied {app.appliedDate}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100/50 mb-6 mt-auto">
                  <div className="relative z-20">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
                    <div className="relative group/select">
                      <select 
                        value={app.status}
                        onChange={(e) => {
                          setApplicants(applicants.map(a => 
                            a.id === app.id ? { ...a, status: e.target.value } : a
                          ));
                        }}
                        className={`appearance-none outline-none pr-8 pl-3 py-1.5 rounded-lg text-xs font-bold ring-1 transition-all cursor-pointer hover:ring-2 ${getStatusColor(app.status)}`}
                      >
                        <option value="Under Review" className="text-gray-900 bg-white">Under Review</option>
                        <option value="Shortlisted" className="text-gray-900 bg-white">Shortlisted</option>
                        <option value="Rejected" className="text-gray-900 bg-white">Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-60" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Match Score</p>
                    <p className={`text-xl font-black leading-none ${getScoreColor(app.matchScore)}`}>
                      {app.matchScore}%
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer ring-1 ring-blue-200 hover:ring-blue-300">
                    <FileText className="h-4 w-4" />
                    Resume
                  </button>
                  <button className="flex-1 bg-linear-to-r from-gray-800 to-gray-900 text-white font-bold py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all text-sm shadow-md cursor-pointer active:scale-95">
                    Review
                  </button>
                </div>
              </div>
            ))}
            
            {filteredApplicants.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
