"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  FileText, 
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    type: "Full-time",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/jobs/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", 
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/manage-jobs");
        }, 2000);
      } else {
        setError(data.message || data.errors?.[0]?.msg || "Failed to post job. Please try again.");
      }
    } catch (err: any) {
      console.error("Error posting job:", err);
      setError("Failed to post job. Please check your connection.");
    } finally {
      setLoading(false);
    }

  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
        <p className="text-gray-600 max-w-md">Your job listing has been created and is now visible to potential candidates. Redirecting you to manage jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a New Job Posting</h1>
        <p className="text-gray-500 mt-2 font-medium">Fill in the details below to attract the best talent for your team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50 mb-2">
            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-gray-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-gray-700">Job Title <span className="text-red-500">*</span></label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-bold text-gray-700">Job Description <span className="text-red-500">*</span></label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Compensation Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-50 mb-2">
            <div className="h-8 w-8 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-gray-900">Details & Compensation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-bold text-gray-700">Location <span className="text-red-500">*</span></label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="salaryRange" className="text-sm font-bold text-gray-700">Salary Range (Optional)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  id="salaryRange"
                  name="salaryRange"
                  placeholder="e.g. $120k - $150k"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-bold text-gray-700">Job Type</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none appearance-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}


        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-10 py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Post Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}