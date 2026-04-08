"use client";

import React from "react";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Building2,
  Globe,
  Users,
  Star,
  Share2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Job Data
const MOCK_JOB = {
  id: 1,
  title: "Senior Software Engineer",
  company: "TechNova Solutions",
  location: "San Francisco, USA",
  type: "Full-Time",
  category: "IT & Software",
  date: "5th Jul 2025",
  salary: "$60k - $85k",
  logo: "https://api.dicebear.com/7.x/initials/svg?seed=TN&backgroundColor=0284c7",
  description: `We are looking for a highly skilled Senior Software Engineer to join our core architecture team. You will be responsible for designing and implementing scalable services, mentoring junior developers, and collaborating cross-functionally to define the technical roadmap of our flagship product.`,
  responsibilities: [
    "Design, develop, and maintain high-performance, scalable web applications.",
    "Collaborate with product managers and designers to transform requirements into technical specifications.",
    "Lead code reviews and ensure high code quality and best practices.",
    "Debug and resolve complex technical issues across the full stack.",
    "Contribute to the continuous improvement of development processes and tooling.",
  ],
  requirements: [
    "Bachelor's degree in Computer Science or related field (Master's preferred).",
    "5+ years of experience in full-stack development with modern frameworks (React, Node.js).",
    "Strong proficiency in TypeScript and asynchronous programming.",
    "Experience with cloud infrastructure (AWS/GCP) and containerization (Docker/Kubernetes).",
    "Excellent communication and problem-solving skills.",
  ],
  benefits: [
    "Competitive salary and equity package",
    "Healthcare, dental, and vision insurance",
    "Flexible working hours and remote options",
    "Professional development stipend",
    "Modern office with well-stocked kitchen",
  ],
  companyInfo: {
    description: "TechNova Solutions is a leading innovator in cloud-native enterprise software. Founded in 2018, we've grown from a small startup to a global team of over 200 passionate builders dedicated to simplifying complex workflows.",
    website: "https://technova.io",
    size: "201-500 employees",
    industry: "Enterprise Software",
  }
};

export default function JobDetailsPage() {
  const params = useParams();
  const id = params.id;

  // In a real app, we would fetch job by ID here
  const job = MOCK_JOB;

  return (
    <div className="max-w-5xl mx-auto pb-20">
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
          <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
            <Bookmark className="h-5 w-5" />
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
                <img src={job.logo} alt={job.company} className="h-full w-full object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    {job.type}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-bold">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Posted {job.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-50">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Salary Range</p>
                <p className="text-lg font-black text-blue-600">{job.salary}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-lg font-black text-gray-900">5+ Years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl col-span-2 md:col-span-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Work Type</p>
                <p className="text-lg font-black text-gray-900">{job.type}</p>
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
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {job.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                Key Responsibilities
              </h2>
              <ul className="grid gap-4">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="h-6 w-6 mt-0.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                Qualifications & Requirements
              </h2>
              <ul className="grid gap-4">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="h-6 w-6 mt-0.5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-600 font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Apply Card */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl p-8 text-white shadow-xl shadow-blue-200">
            <h3 className="text-xl font-bold mb-4">Interested in this role?</h3>
            <p className="text-blue-100 mb-8 font-medium">
              Submit your application today and our team will get back to you soon.
            </p>
            <button className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95 cursor-pointer">
              Apply Now
            </button>
            <p className="text-center text-xs text-blue-200 mt-4 font-bold uppercase tracking-wider">
              Takes less than 5 minutes
            </p>
          </div>

          {/* Company Info Card */}
          <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">About Company</h3>
            <div className="flex items-center gap-4 mb-6">
               <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                <img src={job.logo} alt={job.company} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{job.company}</p>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                  <span className="text-[10px] text-gray-400 font-bold ml-1">4.9 (124 reviews)</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
              {job.companyInfo.description}
            </p>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Website</span>
                </div>
                <a href={job.companyInfo.website} target="_blank" className="text-sm font-bold text-blue-600 hover:underline"> technova.io </a>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Size</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{job.companyInfo.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Industry</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{job.companyInfo.industry}</span>
              </div>
            </div>
          </div>
          
          {/* Benefits Card */}
          <div className="bg-gray-900 rounded-4xl p-8 text-white">
            <h3 className="text-xl font-bold mb-6">Perks & Benefits</h3>
            <div className="space-y-4">
              {job.benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  <span className="text-sm font-medium text-gray-300">{benefit}</span>
                </div>
              ))}
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest pt-2 cursor-pointer hover:text-blue-300">
                + See all benefits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
