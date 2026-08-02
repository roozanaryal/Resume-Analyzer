"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostJob } from "@/features/jobs/hooks";
import { useUser } from "@/features/auth/hooks";

export default function PostJobPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useUser();
  const postJobMutation = usePostJob();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salaryRange, setSalaryRange] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [benefits, setBenefits] = useState("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!title.trim()) {
      setErrorMessage("Job title is required.");
      return;
    }
    if (!location.trim()) {
      setErrorMessage("Location is required.");
      return;
    }
    if (!description.trim() && !responsibilities.trim()) {
      setErrorMessage("Job description is required (at least 10 characters).");
      return;
    }

    // Build comprehensive description
    let fullDescription = description.trim();
    const extraSections: string[] = [];

    if (department.trim()) extraSections.push(`Department: ${department.trim()}`);
    if (experience.trim()) extraSections.push(`Experience Level: ${experience.trim()}`);
    if (responsibilities.trim()) extraSections.push(`Key Responsibilities:\n${responsibilities.trim()}`);
    if (qualifications.trim()) extraSections.push(`Qualifications:\n${qualifications.trim()}`);
    if (benefits.trim()) extraSections.push(`Perks & Benefits:\n${benefits.trim()}`);

    if (extraSections.length > 0) {
      if (fullDescription) {
        fullDescription += "\n\n" + extraSections.join("\n\n");
      } else {
        fullDescription = extraSections.join("\n\n");
      }
    }

    if (fullDescription.length < 10) {
      setErrorMessage("Job description must be at least 10 characters long.");
      return;
    }

    try {
      await postJobMutation.mutateAsync({
        title: title.trim(),
        description: fullDescription,
        location: location.trim(),
        salaryRange: salaryRange.trim() || undefined,
        type: employmentType,
      });

      setSuccessMessage("Job posted successfully!");

      // Reset form fields
      setTitle("");
      setDepartment("");
      setLocation("");
      setSalaryRange("");
      setExperience("");
      setDescription("");
      setResponsibilities("");
      setQualifications("");
      setBenefits("");

      setTimeout(() => {
        router.push("/manage-jobs");
      }, 1500);
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to post job. Please check all fields and try again.";
      setErrorMessage(serverMsg);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-gray-500 font-medium">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-80 w-[320px] rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[18%] h-70 w-70 rounded-full bg-violet-50/70 blur-3xl pointer-events-none" />

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

      <div className="relative z-10 mx-auto px-6 py-10 md:py-14 md:px-12 lg:px-24">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Employer Hub</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-3 text-base text-gray-600">Create a polished job listing that attracts the right candidates and makes hiring faster.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.8fr_1.2fr]">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-4xl border border-gray-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">Job Information</h2>
                <p className="text-sm text-gray-500">Fill out the details below to publish your job posting.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">
                    Job Title <span className="text-rose-500">*</span>
                  </span>
                  <input
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Senior Product Designer"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Department</span>
                  <input
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
                    placeholder="Design, Engineering, Marketing"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">
                    Location <span className="text-rose-500">*</span>
                  </span>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
                    <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                    <input
                      required
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Remote, NYC, London"
                      className="w-full border-none bg-transparent text-sm text-gray-900 outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Employment Type</span>
                  <select
                    value={employmentType}
                    onChange={(event) => setEmploymentType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Salary Range</span>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
                    <DollarSign className="h-4 w-4 text-green-500 shrink-0" />
                    <input
                      value={salaryRange}
                      onChange={(event) => setSalaryRange(event.target.value)}
                      placeholder="$90k - $120k"
                      className="w-full border-none bg-transparent text-sm text-gray-900 outline-none"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">Role Details</h2>
                <p className="text-sm text-gray-500">Describe what the candidate will own and what success looks like.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Experience Level</span>
                  <input
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    placeholder="5+ years"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Candidate Requirements</span>
                  <input
                    value={qualifications}
                    onChange={(event) => setQualifications(event.target.value)}
                    placeholder="Portfolio, React, Figma"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">
                  Job Description <span className="text-rose-500">*</span>
                </span>
                <textarea
                  required
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  placeholder="Write a concise description of the role, responsibilities, and team culture..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Key Responsibilities</span>
                <textarea
                  value={responsibilities}
                  onChange={(event) => setResponsibilities(event.target.value)}
                  rows={4}
                  placeholder="List the key responsibilities for the role..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Perks & Benefits</span>
                <textarea
                  value={benefits}
                  onChange={(event) => setBenefits(event.target.value)}
                  rows={3}
                  placeholder="Competitive salary, Health insurance, Remote options..."
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={postJobMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {postJobMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing Job...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4" />
                  Post Job
                </>
              )}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-4xl border border-gray-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-blue-600">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.35em]">Quick Summary</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Location</p>
                    <p className="text-sm text-gray-500">{location || "Remote / Flexible"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <Clock className="h-5 w-5 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Employment Type</p>
                    <p className="text-sm text-gray-500">{employmentType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <DollarSign className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Salary</p>
                    <p className="text-sm text-gray-500">{salaryRange || "Competitive"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Listing Preview</h2>
                  <p className="text-sm text-gray-500">See how your posting will look to candidates.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Live preview
                </div>
              </div>

              <div className="mt-6 space-y-5 rounded-3xl border border-gray-100 bg-slate-50 p-5">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{employmentType}</p>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">{title || "Senior Product Designer"}</h3>
                  <p className="mt-2 text-sm text-gray-500">{department || "Design Team"} · {location || "Remote"}</p>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="whitespace-pre-line">{description || "Write a concise description of the role, responsibilities, and team culture to help align top candidates."}</p>
                  {qualifications && <p className="text-gray-500">Qualifications: {qualifications}</p>}
                  {benefits && <p className="text-gray-500 text-xs font-medium">Benefits: {benefits}</p>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
