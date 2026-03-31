"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, CheckCircle2 } from "lucide-react";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salaryRange, setSalaryRange] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Job posted successfully!");
    window.setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] h-[320px] w-[320px] rounded-full bg-blue-50/70 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[18%] h-[280px] w-[280px] rounded-full bg-violet-50/70 blur-3xl pointer-events-none" />

      {message && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700 shadow-xl">
          <CheckCircle2 className="h-5 w-5" />
          {message}
        </div>
      )}

      <div className="relative z-10 mx-auto px-6 py-10 md:py-14 md:px-12 lg:px-24">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Employer Hub</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">Post a New Job</h1>
          <p className="mt-3 text-base text-gray-600">Create a polished job listing that attracts the right candidates and makes hiring faster.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.8fr_1.2fr]">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">Job Information</h2>
                <p className="text-sm text-gray-500">Fill out the details below to publish your job posting.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700">Job Title</span>
                  <input
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
                  <span className="text-sm font-semibold text-gray-700">Location</span>
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <input
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
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3">
                    <DollarSign className="h-4 w-4 text-green-500" />
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
                <span className="text-sm font-semibold text-gray-700">Job Description</span>
                <textarea
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
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Briefcase className="h-4 w-4" />
              Post Job
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-blue-600">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.35em]">Quick Summary</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Location</p>
                    <p className="text-sm text-gray-500">{location || "Remote / Flexible"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Employment Type</p>
                    <p className="text-sm text-gray-500">{employmentType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Salary</p>
                    <p className="text-sm text-gray-500">{salaryRange || "Competitive"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
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
                  <p>{description || "Write a concise description of the role, responsibilities, and team culture to help align top candidates."}</p>
                  <p className="text-gray-500">Qualifications: {qualifications || "Portfolio, UX research, design systems"}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
