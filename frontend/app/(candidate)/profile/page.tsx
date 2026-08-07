"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User as UserIcon,
  Mail,
  Briefcase,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  X,
  Code,
  GraduationCap,
  Save,
  Download,
  Building2,
} from "lucide-react";
import { useUser, useUpdateProfile, useUploadResume } from "@/features/auth/hooks";

export default function CandidateProfilePage() {
  const { data: user, isLoading: isUserLoading } = useUser();
  const updateProfileMutation = useUpdateProfile();
  const uploadResumeMutation = useUploadResume();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [preferredJobType, setPreferredJobType] = useState("");
  const [preferredIndustry, setPreferredIndustry] = useState("");
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setSkills(user.skills || "");
      setExperience(user.experience || "");
      setEducation(user.education || "");
      setPreferredJobType(user.preferredJobType || "");
      setPreferredIndustry(user.preferredIndustry || "");
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    try {
      await updateProfileMutation.mutateAsync({
        name,
        bio,
        skills,
        experience,
        education,
        preferredJobType,
        preferredIndustry,
      });
      setSaveStatus({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);
      setSaveStatus(null);
      
      try {
        await uploadResumeMutation.mutateAsync(file);
        setSaveStatus({ type: "success", message: "Resume uploaded successfully!" });
        setResumeFile(null);
        setTimeout(() => setSaveStatus(null), 4000);
      } catch (err: any) {
        setSaveStatus({
          type: "error",
          message: err?.response?.data?.message || "Failed to upload resume",
        });
      }
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const resumeDownloadUrl = user?.resumeURL ? `${backendUrl}${user.resumeURL}` : null;
  const resumeName = user?.resumeURL ? user.resumeURL.split("/").pop() : "";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="relative overflow-hidden bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
        <div className="h-24 w-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
          <UserIcon className="h-12 w-12" />
        </div>
        <div className="text-center md:text-left flex-1 space-y-1 z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {user?.name || "My Profile"}
          </h1>
          <p className="text-blue-100 font-semibold flex items-center justify-center md:justify-start gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0" />
            {user?.email}
          </p>
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mt-2">
            {user?.role}
          </span>
        </div>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 transition-all ${
            saveStatus.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <X className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar: Resume Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Resume File
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Upload your resume once and apply to multiple jobs instantly.
              </p>
            </div>

            {user?.resumeURL ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 overflow-hidden">
                  <FileText className="h-10 w-10 text-blue-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-700 truncate" title={resumeName}>
                      {resumeName}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      Uploaded
                    </span>
                  </div>
                </div>

                {resumeDownloadUrl && (
                  <a
                    href={resumeDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border border-gray-200 hover:border-blue-200 rounded-xl text-gray-700 hover:text-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-blue-50/50 cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center p-4 bg-amber-50/50 border border-amber-100 text-amber-800 rounded-2xl text-xs font-semibold">
                No resume uploaded yet. Upload one below to start applying to jobs.
              </div>
            )}

            <hr className="border-gray-100" />

            {/* Upload Zone */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Upload New Resume
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                  uploadResumeMutation.isPending ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploadResumeMutation.isPending ? (
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin mb-2" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:scale-115 transition-all mb-2" />
                )}
                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600">
                  {uploadResumeMutation.isPending ? "Uploading..." : "Choose File"}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold mt-1">
                  PDF only up to 5MB
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Form Details */}
        <div className="md:col-span-2">
          <form onSubmit={handleProfileSave} className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
              Profile Details
            </h3>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell recruiters about yourself..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 resize-none"
              />
            </div>

            {/* Tech Stack / Skills */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Code className="h-4 w-4 text-blue-600" />
                Skills / Tech Stack
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, Python (comma separated)"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
              <span className="text-[10px] font-semibold text-gray-400 block">
                Separate each skill/technology with a comma.
              </span>
            </div>

            {/* Work Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Work Experience
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Highlight your previous jobs, roles, and major accomplishments..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
            </div>

             {/* Education */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                Education
              </label>
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Describe your academic background, degree, and certifications..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
            </div>

            {/* Preferred Job Role */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Preferred Job Role / Title (for Recommendations)
              </label>
              <input
                type="text"
                value={preferredJobType}
                onChange={(e) => setPreferredJobType(e.target.value)}
                placeholder="e.g. Fullstack Developer, Manager, QA Engineer"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
            </div>

            {/* Preferred Industry */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Preferred Industry (for Recommendations)
              </label>
              <input
                type="text"
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                placeholder="e.g. Tech, Manufacturing, Finance, Healthcare, Service"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
