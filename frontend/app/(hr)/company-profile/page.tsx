"use client";

import React from "react";
import { 
  LayoutDashboard, PlusSquare, Briefcase, Building2, LogOut, 
  Mail, Pencil, CheckCircle2, ChevronDown 
} from "lucide-react";
import Link from "next/link";



export default function CompanyProfilePage() {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}


      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Welcome back!</h2>
            <p className="text-sm font-semibold text-gray-400">Here's what's happening with your jobs today.</p>
          </div>


          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 tracking-tight">John Davis</p>
              <p className="text-xs font-semibold text-gray-400 leading-tight">Employer</p>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
                alt="Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-300 pointer-events-none" />
          </div>
        </header>

        {/* Content */}
        <main className="p-12 flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white rounded-4xl shadow-xl shadow-blue-500/5 overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-blue-600 px-10 py-8 flex items-center justify-between text-white relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-700 pointer-events-none opacity-90" />
              <h1 className="relative z-10 text-2xl font-bold tracking-tight">Employer Profile</h1>
              <button className="relative z-10 flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm backdrop-blur-md transition-all active:scale-95 shadow-sm">
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Personal Information</h3>
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-gray-100 shadow-sm">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
                        alt="John Davis" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 tracking-tight">John Davis</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-gray-400">
                        <Mail className="h-3.5 w-3.5" />
                        company4@timetoprogram.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Company Information</h3>
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner p-3">
                      <div className="h-full w-full rounded-lg bg-blue-600 text-white flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
                        <Building2 className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 tracking-tight">NeoHire Labs</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-gray-400">
                        <Briefcase className="h-3.5 w-3.5" />
                        Company
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">About Company</h3>
                <div className="bg-gray-50/80 p-8 rounded-2xl border border-gray-100 shadow-inner">
                  <p className="text-gray-500 font-medium leading-[1.8] tracking-tight">
                    NeoHire Labs is a recruitment intelligence platform that leverages machine learning to match companies with top-tier tech talent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
