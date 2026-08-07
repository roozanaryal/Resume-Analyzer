"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Loader2,
  MessageSquare,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useJobApplicants, useUpdateApplicationStatus } from "@/features/jobs/hooks";
import { useStartConversation } from "@/features/messages/hooks";

export default function ApplicantsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data, isLoading, isError } = useJobApplicants(id);
  const updateStatusMutation = useUpdateApplicationStatus();
  const startConversationMutation = useStartConversation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [fitModalApplicant, setFitModalApplicant] = useState<any | null>(null);

  const handleStartChat = (userId: string) => {
    if (!userId) return;
    startConversationMutation.mutate(userId, {
      onSuccess: (resData) => {
        router.push(`/hr-messages?roomId=${resData.chatRoomId}`);
      },
      onError: () => {
        alert("Failed to start conversation with candidate.");
      },
    });
  };

  const rawApplications = data?.applications || [];

  const applicants = rawApplications.map((app: any, idx: number) => {
    const formattedDate = app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";

    // Calculate real fit score from backend weighted ranking algorithm
    const fitScore = app.finalScore !== undefined ? app.finalScore : 80;

    return {
      id: app.id,
      userId: app.userId,
      name: app.name || "Candidate",
      role: data?.jobTitle || "Applicant",
      location: "Remote / On-site",
      email: app.email,
      bio: app.bio || "No bio provided.",
      appliedDate: formattedDate,
      status: optimisticStatuses[app.id] || app.status || "PENDING",
      resumeURL: app.resumeURL,
      fitScore,
      skillMatchPercentage: app.skillMatchPercentage || 0,
      experienceScore: app.experienceScore || 0,
      experienceYears: app.experienceYears || 0,
      matchedSkills: app.matchedSkills || [],
      missingSkills: app.missingSkills || [],
      skills: app.skills || [],
      education: app.education || [],
      certifications: app.certifications || [],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        app.name || "Candidate"
      )}&backgroundColor=0284c7`,
    };
  });

  const filteredApplicants = applicants.filter((app: any) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && app.status === "PENDING") ||
      (statusFilter === "Shortlisted" && app.status === "SHORTLISTED") ||
      (statusFilter === "Accepted" && app.status === "ACCEPTED") ||
      (statusFilter === "Rejected" && app.status === "REJECTED");
    return matchesSearch && matchesStatus;
  });

  // Sort by fit score descending
  const sortedApplicants = [...filteredApplicants].sort((a: any, b: any) => b.fitScore - a.fitScore);

  const stats = {
    total: applicants.length,
    pending: applicants.filter((a: any) => a.status === "PENDING").length,
    shortlisted: applicants.filter((a: any) => a.status === "SHORTLISTED").length,
    accepted: applicants.filter((a: any) => a.status === "ACCEPTED").length,
    rejected: applicants.filter((a: any) => a.status === "REJECTED").length,
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setOptimisticStatuses((prev) => ({ ...prev, [applicationId]: newStatus }));
    setOpenDropdownId(null);
    updateStatusMutation.mutate(
      { applicationId, status: newStatus },
      {
        onError: () => {
          setOptimisticStatuses((prev) => {
            const next = { ...prev };
            delete next[applicationId];
            return next;
          });
        },
      }
    );
  };

  const openResume = (resumeURL?: string | null) => {
    if (!resumeURL) {
      alert("No resume uploaded by this applicant.");
      return;
    }
    const fullUrl = resumeURL.startsWith("http")
      ? resumeURL
      : `http://localhost:5000${resumeURL}`;
    window.open(fullUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 ring-red-200";
      case "SHORTLISTED":
        return "bg-purple-50 text-purple-700 ring-purple-200";
      default:
        return "bg-blue-50 text-blue-700 ring-blue-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading job applicants...</span>
      </div>
    );
  }

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
          <span className="text-lg font-bold tracking-tight text-gray-900">Resume Analyzer</span>
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
            <p className="text-base md:text-lg text-gray-600 mt-2">
              Reviewing applicants for: <span className="text-gray-900 font-bold">{data?.jobTitle || "Job Listing"}</span>
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Applicants", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50/80" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50/80" },
            { label: "Shortlisted", value: stats.shortlisted, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50/80" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50/80" },
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

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto" style={{ scrollbarWidth: "none" }}>
              {["All", "Pending", "Shortlisted", "Accepted", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-linear-to-r from-blue-50/50 to-violet-50/50 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-gray-900 font-bold">{filteredApplicants.length}</span> of <span className="text-gray-900 font-bold">{applicants.length}</span> applicants (ranked by Final Fit Score)
            </p>
          </div>

          {/* Applicants Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50/30">
            {sortedApplicants.length > 0 ? (
              sortedApplicants.map((app: any) => (
                <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
                  <div className="flex justify-between items-center mb-5 gap-3">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="relative h-14 w-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                        <img src={app.avatar} alt={app.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-blue-600 transition-colors truncate">
                          {app.name}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500 truncate">{app.role}</p>
                      </div>
                    </div>
                    
                    {/* Clickable Job Fit percentage badge */}
                    <button
                      type="button"
                      onClick={() => setFitModalApplicant(app)}
                      className="px-3 py-1.5 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 text-blue-600 shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xs group/badge"
                      title="Click to view Fitting Algorithm Breakdown"
                    >
                      <Sparkles className="h-3.5 w-3.5 fill-blue-100 text-blue-500 animate-pulse group-hover/badge:rotate-12 transition-transform" />
                      <span className="text-xs font-black">{app.fitScore}% Fit</span>
                    </button>
                  </div>

                  <div className="space-y-3 mb-6 flex-1 bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      Applied {app.appliedDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-gray-100/50 mb-6 mt-auto">
                    <div className="relative z-30 w-full">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Application Status</p>
                      <div className="relative">
                        {/* Custom Dropdown Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setOpenDropdownId(openDropdownId === app.id ? null : app.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold ring-1 transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-98 ${getStatusColor(app.status)}`}
                        >
                          <div className="flex items-center gap-2">
                            {app.status === "PENDING" && <Clock className="h-3.5 w-3.5 text-amber-600" />}
                            {app.status === "SHORTLISTED" && <Sparkles className="h-3.5 w-3.5 text-purple-600" />}
                            {app.status === "ACCEPTED" && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                            {app.status === "REJECTED" && <XCircle className="h-3.5 w-3.5 text-rose-600" />}
                            <span>{app.status}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openDropdownId === app.id ? "rotate-180" : ""}`} />
                        </button>

                        {/* Floating Themed Options Menu */}
                        {openDropdownId === app.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setOpenDropdownId(null)}
                            />
                            <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 border border-gray-100 shadow-xl shadow-blue-900/10 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                              {[
                                { key: "PENDING", label: "PENDING", icon: Clock, color: "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200" },
                                { key: "SHORTLISTED", label: "SHORTLISTED", icon: Sparkles, color: "text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200" },
                                { key: "ACCEPTED", label: "ACCEPTED", icon: CheckCircle, color: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
                                { key: "REJECTED", label: "REJECTED", icon: XCircle, color: "text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200" },
                              ].map((opt) => (
                                <button
                                  key={opt.key}
                                  type="button"
                                  onClick={() => handleStatusChange(app.id, opt.key)}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${opt.color} ${
                                    app.status === opt.key ? "ring-2 ring-blue-500/20 font-black" : "opacity-90 hover:opacity-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-3.5 w-3.5" />
                                    <span>{opt.label}</span>
                                  </div>
                                  {app.status === opt.key && <CheckCircle className="h-3.5 w-3.5" />}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openResume(app.resumeURL)}
                      className="flex-1 bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ring-1 ring-blue-200 hover:ring-blue-300"
                    >
                      <FileText className="h-4 w-4" />
                      Resume
                    </button>
                    <button
                      onClick={() => handleStartChat(app.userId)}
                      disabled={startConversationMutation.isPending}
                      className="px-3 bg-violet-50 text-violet-600 font-bold py-3 rounded-xl hover:bg-violet-100 transition-colors text-xs sm:text-sm flex items-center justify-center cursor-pointer ring-1 ring-violet-200 disabled:opacity-50"
                      title="Send Message"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSelectedApplicant(app)}
                      className="flex-1 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all text-xs sm:text-sm shadow-md cursor-pointer active:scale-95"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants found</h3>
                <p className="text-gray-500 font-medium">No candidates have applied to this position yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Candidate Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Candidate Evaluation & Fit Analysis</h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedApplicant.avatar}
                alt={selectedApplicant.name}
                className="h-16 w-16 rounded-2xl border border-gray-100 shrink-0"
              />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedApplicant.name}</h4>
                <p className="text-sm text-gray-500 font-medium">{selectedApplicant.email}</p>
              </div>
            </div>

            {/* Score Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3 bg-linear-to-r from-blue-50/70 to-violet-50/70 p-4 rounded-2xl border border-blue-100">
              <div className="text-center p-2 bg-white/80 rounded-xl shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Final Weighted Score</p>
                <p className="text-xl font-extrabold text-blue-600">{selectedApplicant.fitScore}%</p>
                <p className="text-[9px] text-gray-400 font-medium">70% Skill + 30% Exp</p>
              </div>
              <div className="text-center p-2 bg-white/80 rounded-xl shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Skill Match (Cosine)</p>
                <p className="text-xl font-extrabold text-violet-600">{selectedApplicant.skillMatchPercentage}%</p>
                <p className="text-[9px] text-gray-400 font-medium">Cosine Similarity</p>
              </div>
              <div className="text-center p-2 bg-white/80 rounded-xl shadow-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Experience Score</p>
                <p className="text-xl font-extrabold text-emerald-600">{Math.round((selectedApplicant.experienceScore || 0) * 100)}%</p>
                <p className="text-[9px] text-gray-400 font-medium">{selectedApplicant.experienceYears} Yrs Exp</p>
              </div>
            </div>

            {/* Tech Skill Breakdown */}
            <div className="space-y-3">
              {selectedApplicant.matchedSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Matched Skills ({selectedApplicant.matchedSkills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.matchedSkills.map((sk: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplicant.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Missing Skills ({selectedApplicant.missingSkills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.missingSkills.map((sk: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border border-amber-200">
                        ! {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplicant.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">All Extracted Resume Skills ({selectedApplicant.skills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((sk: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-lg border border-blue-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Education & Certifications */}
            {(selectedApplicant.education?.length > 0 || selectedApplicant.certifications?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl">
                {selectedApplicant.education?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Education</p>
                    <ul className="text-xs text-gray-700 space-y-1 font-medium list-disc pl-4">
                      {selectedApplicant.education.map((edu: string, i: number) => (
                        <li key={i}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedApplicant.certifications?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Certifications</p>
                    <ul className="text-xs text-gray-700 space-y-1 font-medium list-disc pl-4">
                      {selectedApplicant.certifications.map((cert: string, i: number) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Bio</p>
              <p className="text-sm font-medium text-gray-700">{selectedApplicant.bio}</p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Application Date</p>
                <p className="text-sm font-bold text-gray-900">{selectedApplicant.appliedDate}</p>
              </div>
              <button
                onClick={() => openResume(selectedApplicant.resumeURL)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition cursor-pointer"
              >
                <ExternalLink className="h-4 w-4" />
                View Resume PDF
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fitting Algorithm Breakdown Modal */}
      {fitModalApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 w-5 fill-blue-100" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Fitting Algorithm Breakdown</h3>
                  <p className="text-xs font-semibold text-gray-500">
                    Evaluating candidate match for <span className="text-blue-600 font-bold">{data?.jobTitle || "Job Listing"}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFitModalApplicant(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Candidate Identity summary */}
            <div className="flex items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              <img
                src={fitModalApplicant.avatar}
                alt={fitModalApplicant.name}
                className="h-12 w-12 rounded-xl border border-gray-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-gray-900 truncate">{fitModalApplicant.name}</h4>
                <p className="text-xs text-gray-500 font-medium truncate">{fitModalApplicant.email}</p>
              </div>
              <div className="px-4 py-2 bg-blue-600 text-white font-black text-sm rounded-xl shadow-md">
                {fitModalApplicant.fitScore}% Fit
              </div>
            </div>

            {/* Mathematical Formula Explanation */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50 to-violet-50 border border-blue-100 space-y-2">
              <p className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Weighted Evaluation Formula
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-blue-100/50 text-xs font-mono text-gray-800 font-bold text-center shadow-2xs">
                Final Score = (Cosine Similarity × 0.7) + (Experience Score × 0.3)
              </div>
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Technical skills contribute <span className="font-bold text-gray-900">70%</span> of the final evaluation via vector similarity, while relevant work experience contributes <span className="font-bold text-gray-900">30%</span>.
              </p>
            </div>

            {/* Score Component Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider">Final Weighted Fit</p>
                <p className="text-2xl font-black text-blue-600 my-1">{fitModalApplicant.fitScore}%</p>
                <p className="text-[10px] font-semibold text-gray-500">Combined Ranking</p>
              </div>
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-center">
                <p className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider">Skill Match (70%)</p>
                <p className="text-2xl font-black text-purple-600 my-1">{fitModalApplicant.skillMatchPercentage}%</p>
                <p className="text-[10px] font-semibold text-gray-500">Cosine Vector Score</p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-center">
                <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">Experience (30%)</p>
                <p className="text-2xl font-black text-emerald-600 my-1">{Math.round((fitModalApplicant.experienceScore || 0) * 100)}%</p>
                <p className="text-[10px] font-semibold text-gray-500">{fitModalApplicant.experienceYears} Yrs Experience</p>
              </div>
            </div>

            {/* Detailed Skills Comparison */}
            <div className="space-y-4 pt-2">
              {/* Matched Required Skills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Matched Required Skills ({fitModalApplicant.matchedSkills?.length || 0})
                  </p>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Matches Job Post
                  </span>
                </div>
                {fitModalApplicant.matchedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                    {fitModalApplicant.matchedSkills.map((sk: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-emerald-100/80 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1 shadow-2xs">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 font-medium text-center">
                    No direct skill matches found for required job skills.
                  </div>
                )}
              </div>

              {/* Missing Required Skills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    Missing Required Skills ({fitModalApplicant.missingSkills?.length || 0})
                  </p>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Required by Job
                  </span>
                </div>
                {fitModalApplicant.missingSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-rose-50/30 rounded-2xl border border-rose-100">
                    {fitModalApplicant.missingSkills.map((sk: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-rose-100/80 text-rose-800 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1 shadow-2xs">
                        <XCircle className="h-3 w-3 text-rose-500" />
                        {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/50 rounded-xl text-xs text-emerald-700 font-bold text-center border border-emerald-100">
                    ✓ All required job skills were matched!
                  </div>
                )}
              </div>

              {/* All Extracted Resume Skills */}
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  All Extracted Resume Skills ({fitModalApplicant.skills?.length || 0})
                </p>
                {fitModalApplicant.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-2xl border border-gray-100 max-h-32 overflow-y-auto">
                    {fitModalApplicant.skills.map((sk: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white text-gray-700 font-semibold text-xs rounded-lg border border-gray-200 shadow-2xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-400 font-medium text-center">
                    No technical skills parsed from candidate resume.
                  </div>
                )}
              </div>
            </div>

            {/* Fine-Tuning Advice Banner */}
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                💡 How to Fine-Tune Fitting Results:
              </p>
              <p className="text-amber-800 font-medium leading-relaxed">
                If candidate ranking feels inaccurate, edit the <span className="font-bold">Required Skills</span> or <span className="font-bold">Work Experience</span> fields on your job listing. The Cosine Similarity vector recalculates automatically against updated keywords!
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setFitModalApplicant(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition cursor-pointer"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
