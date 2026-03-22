"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, PlusSquare, Briefcase, Building2, LogOut, 
  Mail, Pencil, CheckCircle2, ChevronDown, Check, X 
} from "lucide-react";
import Link from "next/link";

export default function CompanyProfilePage() {
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "John Davis",
    email: "company4@timetoprogram.com",
    company: "NeoHire Labs",
    about: "NeoHire Labs is a recruitment intelligence platform that leverages machine learning to match companies with top-tier tech talent."
  });
  const [editData, setEditData] = useState(companyData);

  // Auto-dismiss welcome alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAlert(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditStart = () => {
    setEditData(companyData);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    setCompanyData(editData);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      {/* Welcome Alert */}
      {showWelcomeAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 px-6 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg backdrop-blur-sm">
            <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-emerald-700">Welcome! Your profile is ready to edit.</span>
            <button 
              onClick={() => setShowWelcomeAlert(false)}
              className="ml-2 text-emerald-600 hover:text-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto px-6 py-12 md:py-16 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Company Profile</h1>
            <p className="text-base md:text-lg text-gray-600 mt-2">Manage and update your company information</p>
          </div>
          {!isEditing && (
            <button 
              onClick={handleEditStart}
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap">
              <Pencil className="h-5 w-5" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/98">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-blue-600 to-violet-600 px-8 md:px-12 py-8 md:py-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Your Company Details</h2>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Keep your information up to date</p>
          </div>

          {/* Profile Content */}
          <div className="p-8 md:p-12 space-y-12">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              <div className="bg-gradient-to-br from-blue-50/50 to-violet-50/50 p-8 rounded-2xl border border-gray-100/50">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{companyData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <p className="text-lg font-semibold text-gray-900">{companyData.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
              <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-8 rounded-2xl border border-gray-100/50">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.company}
                          onChange={(e) => setEditData({...editData, company: e.target.value})}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{companyData.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">About Company</h3>
              <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-8 rounded-2xl border border-gray-100/50">
                <label className="block text-sm font-bold text-gray-700 mb-4">Company Description</label>
                {isEditing ? (
                  <textarea
                    value={editData.about}
                    onChange={(e) => setEditData({...editData, about: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 resize-none"
                  />
                ) : (
                  <p className="text-gray-700 font-medium leading-relaxed">{companyData.about}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={handleEditSave}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                >
                  <Check className="h-5 w-5" />
                  Save Changes
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
