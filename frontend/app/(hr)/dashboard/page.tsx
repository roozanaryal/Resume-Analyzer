"use client";

import React from "react";
import { 
  TrendingUp, Users, Briefcase, Eye, ArrowUpRight,
  CheckCircle2, Clock, AlertCircle, LineChart, Loader2
} from "lucide-react";
import { useDashboardStats } from "@/features/jobs/hooks";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading dashboard statistics...</span>
      </div>
    );
  }

  const totalJobs = data?.totalJobsPosted ?? 0;
  const totalApps = data?.totalApplications ?? 0;
  const pendingReviews = data?.pendingReviews ?? 0;
  const acceptedCount = data?.acceptedCount ?? 0;

  const stats = [
    {
      title: "Total Jobs Posted",
      value: totalJobs.toString(),
      change: totalJobs > 0 ? "Active" : "None",
      isPositive: true,
      icon: Briefcase,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Active Applications",
      value: totalApps.toString(),
      change: totalApps > 0 ? `${totalApps} Total` : "0 Total",
      isPositive: true,
      icon: Users,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      title: "Pending Reviews",
      value: pendingReviews.toString(),
      change: pendingReviews > 0 ? "Action Required" : "All Clear",
      isPositive: pendingReviews === 0,
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200"
    },
    {
      title: "Accepted Candidates",
      value: acceptedCount.toString(),
      change: acceptedCount > 0 ? "Hired" : "0 Hired",
      isPositive: true,
      icon: CheckCircle2,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    }
  ];

  const recentApplications = (data?.recentApplications || []).map((app: any) => {
    const formattedDate = app.createdAt
      ? new Date(app.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";

    let statusColor = "bg-blue-50 text-blue-600";
    if (app.status === "ACCEPTED") statusColor = "bg-emerald-50 text-emerald-600";
    if (app.status === "REJECTED") statusColor = "bg-rose-50 text-rose-600";
    if (app.status === "REVIEWED") statusColor = "bg-amber-50 text-amber-600";

    return {
      id: app.id,
      name: app.user?.name || "Candidate",
      position: app.job?.title || "Position",
      date: formattedDate,
      status: app.status || "PENDING",
      statusColor
    };
  });

  const topJobs = data?.topJobs || [];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-16">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-87.5 sm:h-125 w-87.5 sm:w-125 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-75 sm:h-100 w-75 sm:w-100 rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-base md:text-lg text-gray-600 mt-2">Welcome back! Here is your live recruitment overview</p>
          </div>
          <Link
            href="/postjob"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} border ${stat.borderColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50">
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-600">{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-gray-600 font-semibold text-sm mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 to-violet-600 px-8 py-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                <span className="text-xs text-blue-100 font-semibold">
                  {recentApplications.length} latest
                </span>
              </div>

              {/* Content */}
              <div className="divide-y divide-gray-100">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app: any) => (
                    <div key={app.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{app.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{app.position}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-xs text-gray-500">{app.date}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${app.statusColor}`}>
                          {app.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-gray-500 font-medium">
                    No applications received yet. Applications submitted by candidates will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Pending Reviews */}
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Applications waiting for your review</p>
            </div>

            {/* In Progress */}
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Postings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalJobs}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Active job listings managed by you</p>
            </div>

            {/* Conversion Rate */}
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Acceptance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalApps > 0 ? `${Math.round((acceptedCount / totalApps) * 100)}%` : "0%"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Applications accepted out of total received</p>
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="mt-12">
          <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-violet-600 px-8 py-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Your Job Postings & Performance
              </h2>
              <Link
                href="/manage-jobs"
                className="text-xs font-bold text-white underline hover:text-blue-100 transition"
              >
                Manage All Jobs →
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Title</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Applications</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topJobs.length > 0 ? (
                    topJobs.map((job: any) => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-gray-900">{job.title}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">
                            <Users className="h-4 w-4" />
                            {job.applications}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                            {job.type || "Full-Time"}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Link
                            href={`/manage-jobs/${job.id}/applicants`}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            View Applicants
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-8 text-center text-gray-500 font-medium">
                        No jobs posted yet. Click &quot;Post New Job&quot; above to create your first listing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
