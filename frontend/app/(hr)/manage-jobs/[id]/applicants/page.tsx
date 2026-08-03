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

  const applicants = rawApplications.map((app: any) => {
    const formattedDate = app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";

    return {
      id: app.id,
      userId: app.userId,
      name: app.name || "Candidate",
      role: data?.jobTitle || "Applicant",
      location: "Remote / On-site",
      email: app.email,
      bio: app.bio || "No bio provided.",
      appliedDate: formattedDate,
      status: app.status || "PENDING",
      resumeURL: app.resumeURL,
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
      (statusFilter === "Under Review" && app.status === "PENDING") ||
      (statusFilter === "Reviewed" && app.status === "REVIEWED") ||
      (statusFilter === "Accepted" && app.status === "ACCEPTED") ||
      (statusFilter === "Rejected" && app.status === "REJECTED");
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applicants.length,
    pending: applicants.filter((a: any) => a.status === "PENDING").length,
    accepted: applicants.filter((a: any) => a.status === "ACCEPTED").length,
    rejected: applicants.filter((a: any) => a.status === "REJECTED").length,
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus });
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
      case "REVIEWED":
        return "bg-amber-50 text-amber-700 ring-amber-200";
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
              {["All", "Under Review", "Reviewed", "Accepted", "Rejected"].map((status) => (
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
              Showing <span className="text-gray-900 font-bold">{filteredApplicants.length}</span> of <span className="text-gray-900 font-bold">{applicants.length}</span> applicants
            </p>
          </div>

          {/* Applicants Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50/30">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((app: any) => (
                <div key={app.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-4 items-center">
                      <div className="relative h-14 w-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                        <img src={app.avatar} alt={app.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-blue-600 transition-colors">
                          {app.name}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500">{app.role}</p>
                      </div>
                    </div>
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
                    <div className="relative z-20 w-full">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
                      <div className="relative group/select">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className={`w-full appearance-none outline-none pr-8 pl-3 py-2 rounded-xl text-xs font-bold ring-1 transition-all cursor-pointer hover:ring-2 ${getStatusColor(app.status)}`}
                        >
                          <option value="PENDING" className="text-gray-900 bg-white">PENDING</option>
                          <option value="REVIEWED" className="text-gray-900 bg-white">REVIEWED</option>
                          <option value="ACCEPTED" className="text-gray-900 bg-white">ACCEPTED</option>
                          <option value="REJECTED" className="text-gray-900 bg-white">REJECTED</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-60" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Applicant Details</h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedApplicant.avatar}
                alt={selectedApplicant.name}
                className="h-16 w-16 rounded-2xl border border-gray-100"
              />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedApplicant.name}</h4>
                <p className="text-sm text-gray-500 font-medium">{selectedApplicant.email}</p>
              </div>
            </div>

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition"
              >
                <ExternalLink className="h-4 w-4" />
                View Resume PDF
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
