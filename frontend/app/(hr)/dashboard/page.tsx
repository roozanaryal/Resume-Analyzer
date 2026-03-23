"use client";

import React, { useState } from "react";
import { 
  TrendingUp, Users, Briefcase, Eye, ArrowUpRight,
  CheckCircle2, Clock, AlertCircle, LineChart
} from "lucide-react";

export default function DashboardPage() {
  const [stats] = useState([
    {
      title: "Total Jobs Posted",
      value: "24",
      change: "+12%",
      isPositive: true,
      icon: Briefcase,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Active Applications",
      value: "156",
      change: "+23%",
      isPositive: true,
      icon: Users,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      title: "Profile Views",
      value: "2,849",
      change: "+8%",
      isPositive: true,
      icon: Eye,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      title: "Jobs Filled",
      value: "8",
      change: "+2",
      isPositive: true,
      icon: CheckCircle2,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200"
    }
  ]);

  const [recentApplications] = useState([
    {
      id: 1,
      name: "Sarah Anderson",
      position: "Senior React Developer",
      date: "2 hours ago",
      status: "New",
      statusColor: "bg-blue-50 text-blue-600"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "UI/UX Designer",
      date: "5 hours ago",
      status: "Reviewing",
      statusColor: "bg-amber-50 text-amber-600"
    },
    {
      id: 3,
      name: "Emma Wilson",
      position: "DevOps Engineer",
      date: "1 day ago",
      status: "Interview",
      statusColor: "bg-emerald-50 text-emerald-600"
    },
    {
      id: 4,
      name: "James Robert",
      position: "Product Manager",
      date: "2 days ago",
      status: "Hired",
      statusColor: "bg-green-50 text-green-600"
    }
  ]);

  const [jobsPerformance] = useState([
    {
      title: "Senior Software Engineer",
      applications: 45,
      views: 234,
      filled: true
    },
    {
      title: "UX/UI Designer",
      applications: 32,
      views: 189,
      filled: false
    },
    {
      title: "DevOps Engineer",
      applications: 28,
      views: 156,
      filled: false
    }
  ]);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-base md:text-lg text-gray-600 mt-2">Welcome back! Here&rsquo;s your recruitment overview</p>
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
              <div className="bg-linear-to-r from-blue-600 to-violet-600 px-8 py-6">
                <h2 className="text-xl font-bold text-white">Recent Applications</h2>
              </div>

              {/* Content */}
              <div className="divide-y divide-gray-100">
                {recentApplications.map((app) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Pending Reviews */}
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
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
                  <p className="text-sm text-gray-600 font-semibold">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Interviews scheduled this week</p>
            </div>

            {/* Conversion Rate */}
            <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">33%</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Applications to hires this month</p>
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="mt-12">
          <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-violet-600 px-8 py-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Top Performing Jobs
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Job Title</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Applications</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Views</th>
                    <th className="px-8 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobsPerformance.map((job, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
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
                        <p className="font-bold text-gray-900">{job.views}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${
                          job.filled 
                            ? "bg-emerald-50 text-emerald-600" 
                            : "bg-amber-50 text-amber-600"
                        }`}>
                          {job.filled ? "Filled" : "Open"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
