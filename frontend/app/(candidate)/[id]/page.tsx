"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  Globe,
  Users,
  Star,
  Share2,
  Bookmark,
  MessageSquare,
  Upload,
  FileText,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useJob,
  useSavedJobs,
  useToggleSaveJob,
  useApplyToJob,
  useJobApplicationStatus,
} from "@/features/jobs/hooks";
import { useUser } from "@/features/auth/hooks";

export default function JobDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: user } = useUser();
  const { data: job, isLoading, isError } = useJob(id);
  const { data: savedJobsData } = useSavedJobs();
  const { data: appStatusData } = useJobApplicationStatus(id);
  const toggleSaveMutation = useToggleSaveJob();
  const applyMutation = useApplyToJob();

  const [resume, setResume] = useState<File | null>(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const savedJobIds: string[] = (savedJobsData?.savedJobs || []).map(
    (sj: any) => sj.jobId || sj.job?.id
  );
  const isSaved = savedJobIds.includes(String(id));
  const hasApplied = appStatusData?.hasApplied || false;
  const hasProfileResume = !!user?.resumeURL;

  // Sync state if user changes/loads
  useEffect(() => {
    if (user) {
      setUseProfileResume(!!user.resumeURL);
    }
  }, [user]);

  const handleToggleSave = () => {
    if (id) {
      toggleSaveMutation.mutate({ jobId: id, isSaved });
    }
  };

  const handleApply = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const shouldApplyWithProfile = useProfileResume && hasProfileResume;
    if (!shouldApplyWithProfile && !resume) {
      setErrorMessage("Please upload a resume to apply.");
      return;
    }

    try {
      await applyMutation.mutateAsync({
        jobId: id,
        resume: shouldApplyWithProfile ? null : resume,
      });

      setSuccessMessage("Application submitted successfully!");
      setResume(null);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to submit application. Please make sure you are logged in.";
      setErrorMessage(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading job details...</span>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
        <p className="text-gray-500 max-w-md">
          The job posting you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/find-jobs"
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const companyName =
    job.employer?.companyName || job.employer?.name || "Company";

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const companyLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    companyName
  )}&backgroundColor=0284c7`;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Success Banner */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 shadow-xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/find-jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <div className="h-8 w-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Search
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Job link copied to clipboard!");
              }
            }}
            className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm cursor-pointer"
            title="Share Job"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleToggleSave}
            className={`h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isSaved
                ? "text-blue-600 bg-blue-50 border-blue-200"
                : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            }`}
            title={isSaved ? "Saved" : "Save Job"}
          >
            <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full -mr-16 -mt-16" />

            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-white border border-gray-100 shadow-md p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.employer?.companyIndustry || "Software & Tech"}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.type || "Full-Time"}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-bold">{companyName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Posted {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-50">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Salary Range
                </p>
                <p className="text-lg font-black text-blue-600">
                  {job.salaryRange || "Competitive"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Company Size
                </p>
                <p className="text-lg font-black text-gray-900">
                  {job.employer?.companySize || "11-50 employees"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Experience
                </p>
                <p className="text-lg font-black text-gray-900">
                  {job.experienceRequired || "Any Experience"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Work Type
                </p>
                <p className="text-lg font-black text-gray-900">
                  {job.type || "Full-Time"}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="bg-white rounded-4xl p-8 md:p-10 border border-gray-100 shadow-sm space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                Job Description
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Required Skills Section */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                Required Skills & Qualifications
              </h2>
              {job.skillsRequired ? (
                <div className="flex flex-wrap gap-2.5">
                  {job.skillsRequired
                    .split(/[,;\n]+/)
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2.5 bg-blue-50/80 text-blue-700 font-bold text-sm rounded-xl border border-blue-100 shadow-xs flex items-center gap-2"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-400 italic">
                  No explicit skills listed. Please refer to the job description above.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Apply Card */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl p-8 text-white shadow-xl shadow-blue-200">
            <h3 className="text-xl font-bold mb-4">
              {hasApplied ? "Application Status" : "Interested in this role?"}
            </h3>
            <p className="text-blue-100 mb-6 font-medium">
              {hasApplied
                ? "You have already applied for this position."
                : "Submit your application with your resume to stand out to the employer."}
            </p>

            {/* Resume Upload Section */}
            {!hasApplied && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-blue-100 mb-3 uppercase tracking-wider">
                  Your Resume
                </label>

                {hasProfileResume && (
                  <div className="mb-4 flex items-center gap-2 bg-white/10 p-3.5 rounded-2xl border border-white/20">
                    <input
                      type="checkbox"
                      id="useProfileResumeCheckbox"
                      checked={useProfileResume}
                      onChange={(e) => setUseProfileResume(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="useProfileResumeCheckbox" className="text-xs font-bold text-white select-none cursor-pointer flex-1">
                      Use my profile resume
                    </label>
                  </div>
                )}

                {useProfileResume && hasProfileResume ? (
                  <div className="w-full bg-white/10 rounded-2xl p-4 flex items-center gap-4 border border-white/20">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-500 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-bold text-white truncate">
                        {user.resumeURL?.split("/").pop()}
                      </p>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
                        Saved in Profile
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {!resume ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-blue-400/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 hover:border-white transition-all group"
                      >
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">Click to upload</p>
                        <p className="text-xs text-blue-200 font-medium">PDF only (Max. 5MB)</p>
                      </div>
                    ) : (
                      <div className="w-full bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/20">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{resume.name}</p>
                            <p className="text-xs text-blue-200 font-medium mt-0.5">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setResume(null)}
                          className="h-8 w-8 shrink-0 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-blue-200 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={hasApplied || applyMutation.isPending}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                hasApplied
                  ? "bg-emerald-500 text-white cursor-default shadow-none"
                  : "bg-white text-blue-600 hover:bg-blue-50 cursor-pointer disabled:opacity-50"
              }`}
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : hasApplied ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Applied
                </>
              ) : (
                "Apply Now"
              )}
            </button>
            <p className="text-center text-xs text-blue-200 mt-4 font-bold uppercase tracking-wider">
              {hasApplied ? "Application Received" : "Takes less than 5 minutes"}
            </p>
          </div>

          {/* Company Info Card */}
          <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">About Company</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">{companyName}</p>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                  <span className="text-[10px] text-gray-400 font-bold ml-1">
                    4.9 (Verified)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
              {job.employer?.bio || "No company description provided."}
            </p>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Website
                  </span>
                </div>
                {job.employer?.companyWebsite ? (
                  <a
                    href={
                      job.employer.companyWebsite.startsWith("http")
                        ? job.employer.companyWebsite
                        : `https://${job.employer.companyWebsite}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    {job.employer.companyWebsite}
                  </a>
                ) : (
                  <span className="text-sm font-bold text-gray-400">Not set</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Size
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {job.employer?.companySize || "11-50 employees"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Industry
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {job.employer?.companyIndustry || "Software & Technology"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
