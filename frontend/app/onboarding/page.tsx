"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Briefcase,
  Building2,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  X,
  Globe,
  Users,
  Compass,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { useUser, useUpdateProfile, useUploadResume } from "@/features/auth/hooks";

export default function OnboardingPage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const updateProfileMutation = useUpdateProfile();
  const uploadResumeMutation = useUploadResume();
  const router = useRouter();

  // Common details
  const [bio, setBio] = useState("");
  
  // Candidate specific details
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [preferredJobType, setPreferredJobType] = useState("Full-time");
  const [preferredIndustry, setPreferredIndustry] = useState("");
  
  // HR specific details
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState("11-50 employees");
  const [companyIndustry, setCompanyIndustry] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHR = user?.role === "HR";

  // Initialize if user already has some fields filled
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setSkills(user.skills || "");
      setExperience(user.experience || "");
      setEducation(user.education || "");
      if (user.preferredJobType) setPreferredJobType(user.preferredJobType);
      setPreferredIndustry(user.preferredIndustry || "");
      
      setCompanyName(user.companyName || "");
      setCompanyWebsite(user.companyWebsite || "");
      if (user.companySize) setCompanySize(user.companySize);
      setCompanyIndustry(user.companyIndustry || "");
    }
  }, [user]);



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setSubmitStatus(null);
      
      try {
        await uploadResumeMutation.mutateAsync(file);
        setSubmitStatus({ type: "success", message: "Resume uploaded successfully!" });
        setTimeout(() => setSubmitStatus(null), 3000);
      } catch (err: any) {
        setSubmitStatus({
          type: "error",
          message: err?.response?.data?.message || "Failed to upload resume",
        });
      }
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsSubmitting(true);

    try {
      if (user?.role === "HR") {
        if (!companyName || !companyIndustry) {
          throw new Error("Company Name and Industry are required");
        }
        await updateProfileMutation.mutateAsync({
          companyName,
          companyWebsite,
          companySize,
          companyIndustry,
          bio,
        });
      } else {
        if (!skills || !preferredIndustry) {
          throw new Error("Skills and Preferred Industry are required");
        }
        await updateProfileMutation.mutateAsync({
          bio,
          skills,
          experience,
          education,
          preferredJobType,
          preferredIndustry,
        });
      }

      setSubmitStatus({ type: "success", message: "Profile setup completed!" });
      
      setTimeout(() => {
        router.push(user?.role === "HR" ? "/postjob" : "/find-jobs");
      }, 1500);
    } catch (err: any) {
      setSubmitStatus({
        type: "error",
        message: err.message || err?.response?.data?.message || "Failed to complete onboarding",
      });
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-gray-500 font-semibold">Loading setup wizard...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-100/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full mx-auto space-y-8 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 mb-2">
            {isHR ? <Building2 className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {isHR 
              ? "Tell us about your company to start posting jobs and sourcing talents." 
              : "Tell us about your skills and interests to get customized job recommendations."}
          </p>
        </div>

        {submitStatus && (
          <div
            className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 transition-all ${
              submitStatus.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <X className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{submitStatus.message}</span>
          </div>
        )}

        <form onSubmit={handleOnboardingSubmit} className="space-y-6">
          {isHR ? (
            /* HR ONBOARDING FORM */
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Industry / Domain *
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={companyIndustry}
                      onChange={(e) => setCompanyIndustry(e.target.value)}
                      placeholder="e.g. Technology, Finance"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Company Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  About Company
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your company mission, culture, or what you do..."
                  rows={4}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            /* CANDIDATE ONBOARDING FORM */
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Skills * (Comma-separated)
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Python"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Preferred Industry *
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={preferredIndustry}
                      onChange={(e) => setPreferredIndustry(e.target.value)}
                      placeholder="e.g. Technology, Healthcare"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Education / Qualifications
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Preferred Job Type
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={preferredJobType}
                      onChange={(e) => setPreferredJobType(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Remote</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Professional Experience
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your previous work experience or projects..."
                  rows={3}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Short Bio / Summary
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief professional summary about yourself..."
                  rows={3}
                  className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Resume File Upload Widget */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Resume File (PDF preferred)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer hover:bg-blue-50/20 transition-all group flex flex-col items-center justify-center gap-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div className="h-10 w-10 rounded-xl bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                    {uploadResumeMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                  </div>
                  {user?.resumeURL ? (
                    <div>
                      <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5 justify-center">
                        <FileText className="h-4 w-4" />
                        Resume uploaded successfully
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Click to upload a different file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-gray-700">Click to upload your resume</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">PDF only (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <button
            type="submit"
            disabled={isSubmitting || uploadResumeMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving profile setup...
              </>
            ) : (
              <>
                Finish Profile Setup
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
