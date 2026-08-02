"use client";

import React, { useState } from "react";
import { 
  Search, Plus, ChevronDown, Users, Pencil, X, Trash2, Briefcase, Check, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import { useMyJobs, useDeleteJob, useUpdateJob } from "@/features/jobs/hooks";

export default function ManageJobsPage() {
  const { data, isLoading, isError } = useMyJobs();
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State for Edit Job modal
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalaryRange, setEditSalaryRange] = useState("");
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // State for Delete confirmation modal
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const rawJobs = Array.isArray(data) ? data : (data as any)?.jobs || [];

  const jobsList = rawJobs.map((j: any) => ({
    id: j.id,
    title: j.title,
    location: j.location,
    salaryRange: j.salaryRange || "Competitive",
    type: j.type || "Full-Time",
    description: j.description,
    status: "Active",
    applicants: j._count?.applications ?? 0,
    createdAt: j.createdAt
      ? new Date(j.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently",
  }));

  const filteredJobs = jobsList.filter((job: any) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && job.status === "Active");
    return matchesSearch && matchesStatus;
  });

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditLocation(job.location);
    setEditSalaryRange(job.salaryRange);
    setEditType(job.type);
    setEditDescription(job.description);
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setIsUpdating(true);
    try {
      await updateJobMutation.mutateAsync({
        id: editingJob.id,
        data: {
          title: editTitle,
          location: editLocation,
          salaryRange: editSalaryRange,
          type: editType,
          description: editDescription,
        },
      });
      setEditingJob(null);
    } catch (err: any) {
      alert("Failed to update job: " + (err?.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJobMutation.mutateAsync(id);
      setDeletingJobId(null);
    } catch (err: any) {
      alert("Failed to delete job: " + (err?.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading your jobs...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-87.5 sm:h-125 w-87.5 sm:w-125 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-75 sm:h-100 w-75 sm:w-100 rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        {/* Main Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Manage Jobs</h1>
            <p className="text-base md:text-lg text-gray-600 mt-2">View, edit, and track applicants for all your posted listings</p>
          </div>
          <Link
            href="/postjob"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 text-sm"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </Link>
        </div>

        {/* Content Container */}
        <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
          {/* Search & Filter Bar */}
          <div className="p-6 border-b border-gray-100/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search job title or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              {["All", "Active"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                    statusFilter === status 
                      ? "bg-blue-600 text-white border border-blue-600 shadow-sm" 
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-linear-to-r from-blue-50/50 to-violet-50/50 border-b border-gray-100/50">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-gray-900 font-bold">{filteredJobs.length}</span> of <span className="text-gray-900 font-bold">{jobsList.length}</span> total jobs
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30">
                  <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Applicants</th>
                  <th className="py-5 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                  <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job: any) => (
                    <tr key={job.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="py-5 px-8">
                        <div className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </div>
                        <div className="text-xs font-medium text-gray-500 mt-1">
                          Posted on {job.createdAt} • {job.type}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-sm font-semibold text-gray-700">{job.location}</span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <Link
                          href={`/manage-jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Users className="h-3.5 w-3.5" />
                          {job.applicants} Applicants
                        </Link>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(job)}
                            className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Job"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeletingJobId(job.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      No jobs found. Try adjusting your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-gray-100">
            {filteredJobs.map((job: any) => (
              <div key={job.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{job.location} • {job.type}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/manage-jobs/${job.id}/applicants`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700"
                  >
                    <Users className="h-4 w-4" />
                    {job.applicants} Applicants
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingJobId(job.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Job Listing</h3>
              <button
                onClick={() => setEditingJob(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Work Type
                  </label>
                  <input
                    type="text"
                    required
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    placeholder="Full-Time / Remote"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={editSalaryRange}
                  onChange={(e) => setEditSalaryRange(e.target.value)}
                  placeholder="e.g. $60k - $90k"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center">
            <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job Post</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this job listing? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow-lg shadow-rose-500/20"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}